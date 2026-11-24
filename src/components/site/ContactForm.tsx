import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  contactSchema,
  inquiryTypes,
  submitContact,
  type InquiryType,
} from "@/lib/contact.functions";
import { contactChannels } from "@/lib/site";

type Status = "idle" | "loading" | "success" | "error" | "unavailable";

const field =
  "w-full rounded-2xl glass-subtle px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-[border-color,background-color,box-shadow] duration-200 focus:border-primary focus:bg-primary-soft focus:ring-2 focus:ring-primary/20";

const inquiryLabels: Record<InquiryType, string> = {
  general: "General Inquiry",
  software: "Software & Services",
  courses: "Course Information",
};

const messageHints: Record<InquiryType, string> = {
  general: "How can we help?",
  software: "Tell us about your business and the workflow you want to improve.",
  courses: "Which course are you interested in, and what are your goals?",
};

export function ContactForm({ defaultInquiry = "general" }: { defaultInquiry?: InquiryType }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [inquiryType, setInquiryType] = useState<InquiryType>(defaultInquiry);

  useEffect(() => {
    setInquiryType(defaultInquiry);
  }, [defaultInquiry]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const parsed = contactSchema.safeParse(data);

    if (!parsed.success) {
      setErrors(
        Object.fromEntries(
          parsed.error.issues.map((issue) => [String(issue.path[0] ?? "form"), issue.message]),
        ),
      );
      setStatus("idle");
      return;
    }

    setErrors({});
    setStatus("loading");

    try {
      const result = await submitContact({ data: parsed.data });
      if (result.ok) {
        form.reset();
        setInquiryType(defaultInquiry);
        setStatus("success");
        return;
      }
      setStatus(result.reason === "not_configured" ? "unavailable" : "error");
    } catch {
      setStatus("error");
    }
  }

  const hasError = (key: string) => Boolean(errors[key]);
  const err = (key: string) =>
    errors[key] ? (
      <p id={`${key}-error`} className="mt-1.5 text-xs text-destructive">
        {errors[key]}
      </p>
    ) : null;

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-busy={status === "loading"}
      className="space-y-5 rounded-4xl glass-strong edge-light p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            className={field}
            autoComplete="name"
            placeholder="Jane Doe"
            required
            aria-invalid={hasError("name")}
            aria-describedby={hasError("name") ? "name-error" : undefined}
          />
          {err("name")}
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={field}
            autoComplete="email"
            placeholder="you@example.com"
            required
            aria-invalid={hasError("email")}
            aria-describedby={hasError("email") ? "email-error" : undefined}
          />
          {err("email")}
        </div>
        <div>
          <label htmlFor="phone" className="mb-2 block text-sm">
            Phone <span className="text-muted-foreground">(optional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className={field}
            autoComplete="tel"
            placeholder="Your phone number"
            aria-invalid={hasError("phone")}
            aria-describedby={hasError("phone") ? "phone-error" : undefined}
          />
          {err("phone")}
        </div>
        <div>
          <label htmlFor="inquiryType" className="mb-2 block text-sm">
            Inquiry Type
          </label>
          <select
            id="inquiryType"
            name="inquiryType"
            value={inquiryType}
            onChange={(event) => setInquiryType(event.target.value as InquiryType)}
            className={`${field} bg-card`}
          >
            {inquiryTypes.map((type) => (
              <option key={type} value={type}>
                {inquiryLabels[type]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          className={field}
          placeholder={messageHints[inquiryType]}
          required
          aria-invalid={hasError("message")}
          aria-describedby={hasError("message") ? "message-error" : undefined}
        />
        {err("message")}
      </div>

      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          type="submit"
          variant="glow"
          size="lg"
          disabled={status === "loading"}
          className="w-full sm:w-auto"
        >
          {status === "loading" && <Loader2 className="animate-spin" aria-hidden="true" />}
          {status === "loading" ? "Sending..." : "Send Message"}
        </Button>
        <div aria-live="polite" className="text-sm">
          {status === "success" && (
            <p role="status" className="text-primary-text">
              Thanks, your message has been sent. We'll be in touch soon.
            </p>
          )}
          {status === "unavailable" && (
            <p role="status" className="text-muted-foreground">
              Online submissions aren't connected yet, so your message was not sent.
              {contactChannels.email ? (
                <>
                  {" "}
                  Please email{" "}
                  <a
                    className="underline underline-offset-4"
                    href={`mailto:${contactChannels.email}`}
                  >
                    {contactChannels.email}
                  </a>
                  .
                </>
              ) : null}
            </p>
          )}
          {status === "error" && (
            <p role="alert" className="text-destructive">
              Something went wrong. Please try again
              {contactChannels.email ? (
                <>
                  , or email{" "}
                  <a
                    className="underline underline-offset-4"
                    href={`mailto:${contactChannels.email}`}
                  >
                    {contactChannels.email}
                  </a>
                </>
              ) : null}
              .
            </p>
          )}
        </div>
      </div>

      {contactChannels.email && status !== "unavailable" && status !== "error" && (
        <p className="text-xs text-muted-foreground">
          Prefer email? Reach us at{" "}
          <a className="underline underline-offset-4" href={`mailto:${contactChannels.email}`}>
            {contactChannels.email}
          </a>
          .
        </p>
      )}
    </form>
  );
}
