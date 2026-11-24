import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const inquiryTypes = ["general", "software", "courses"] as const;
export type InquiryType = (typeof inquiryTypes)[number];

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z
    .string()
    .trim()
    .max(40, "Please enter a shorter phone number")
    .refine(
      (value) => value === "" || /^[+()\d][\d\s().-]{5,}$/.test(value),
      "Please enter a valid phone number",
    )
    .optional()
    .default(""),
  inquiryType: z.enum(inquiryTypes),
  message: z.string().trim().min(10, "Please add a few more details").max(2000),
  website: z.string().trim().max(500).optional().default(""), // honeypot
});

const inquiryLabels: Record<InquiryType, string> = {
  general: "General inquiry",
  software: "Software & services",
  courses: "Course information",
};

export type ContactPayload = z.infer<typeof contactSchema>;

export type ContactResult =
  { ok: true } | { ok: false; reason: "not_configured" | "delivery_failed" };

function readEnv(...keys: string[]): string | undefined {
  if (typeof process === "undefined" || !process.env) return undefined;
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return undefined;
}

function formatMessage(data: ContactPayload): string {
  return [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || "Not provided"}`,
    `Inquiry type: ${inquiryLabels[data.inquiryType]}`,
    "",
    "Message:",
    data.message,
  ].join("\n");
}

async function sendToWebhook(data: ContactPayload): Promise<boolean> {
  const url = readEnv("CONTACT_WEBHOOK_URL");
  if (!url) return false;

  const token = readEnv("CONTACT_WEBHOOK_TOKEN");
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      type: "contact-submission",
      submittedAt: new Date().toISOString(),
      source: "eyercall-website",
      name: data.name,
      email: data.email,
      phone: data.phone,
      inquiryType: data.inquiryType,
      message: data.message,
    }),
  });

  if (!response.ok) {
    throw new Error(`Contact webhook responded with ${response.status}`);
  }
  return true;
}

async function sendWithResend(data: ContactPayload): Promise<boolean> {
  const apiKey = readEnv("RESEND_API_KEY");
  const to = readEnv("CONTACT_EMAIL_TO", "CONTACT_TO_EMAIL");
  if (!apiKey || !to) return false;

  const from = readEnv("CONTACT_EMAIL_FROM") ?? "Eyercall Website <onboarding@resend.dev>";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: to
        .split(",")
        .map((address) => address.trim())
        .filter(Boolean),
      reply_to: data.email,
      subject: `New website enquiry from ${data.name}`,
      text: formatMessage(data),
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend responded with ${response.status}`);
  }
  return true;
}

export const submitContact = createServerFn({ method: "POST" })
  .validator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data }): Promise<ContactResult> => {
    // Silently accept obvious bots without forwarding anything to the
    // configured destination.
    if (data.website) return { ok: true };

    const hasWebhook = Boolean(readEnv("CONTACT_WEBHOOK_URL"));
    const hasResend = Boolean(
      readEnv("RESEND_API_KEY") && readEnv("CONTACT_EMAIL_TO", "CONTACT_TO_EMAIL"),
    );

    if (!hasWebhook && !hasResend) {
      return { ok: false, reason: "not_configured" };
    }

    const senders = [
      ...(hasWebhook ? [sendToWebhook] : []),
      ...(hasResend ? [sendWithResend] : []),
    ];

    for (const send of senders) {
      try {
        if (await send(data)) return { ok: true };
      } catch (error) {
        console.error("Contact form delivery failed", error);
      }
    }

    return { ok: false, reason: "delivery_failed" };
  });
