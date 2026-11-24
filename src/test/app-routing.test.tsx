import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { contactSchema } from "@/lib/contact.functions";
import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

  it.each([
    ["/", "/"],
    ["/about", "/about"],
    ["/software", "/software/"],
    ["/software/eyerrems", "/software/$slug"],
    ["/software/eyerflow", "/software/$slug"],
    ["/software/eyerstock", "/software/$slug"],
    ["/software/eyertype", "/software/$slug"],
    ["/courses", "/courses/"],
    ["/courses/cyber-security", "/courses/$slug"],
    ["/courses/web-development", "/courses/$slug"],
    ["/courses/ites", "/courses/$slug"],
    ["/courses/graphic-designing", "/courses/$slug"],
    ["/courses/video-editing", "/courses/$slug"],
    ["/courses/basic-computer", "/courses/$slug"],
    ["/services", "/services"],
    ["/contact", "/contact"],
    ["/privacy", "/privacy"],
  ])("matches %s to the correct route", (path, routeId) => {
    const matches = router.matchRoutes(path);

    expect(matches.at(-1)?.routeId).toBe(routeId);
  });

  it("keeps the legacy products URL on a route so it can redirect", () => {
    const matches = router.matchRoutes("/products");

    expect(matches.at(-1)?.routeId).toBe("/products/");
  });

  it("matches a page for / instead of falling back to not found", () => {
    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("falls back to the root not-found match for an unknown page", () => {
    const matches = router.matchRoutes("/this-page-does-not-exist");

    expect(matches.at(-1)?.routeId).toBe(rootRouteId);
  });
});

describe("Contact form validation", () => {
  const valid = {
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "+1 555 010 0000",
    inquiryType: "software" as const,
    message: "I would like to request a demo of EyerREMS.",
    website: "",
  };

  it("accepts a complete submission", () => {
    const result = contactSchema.safeParse(valid);

    expect(result.success).toBe(true);
  });

  it("accepts a submission without a phone number", () => {
    const { phone: _phone, ...withoutPhone } = valid;

    expect(contactSchema.safeParse(withoutPhone).success).toBe(true);
  });

  it("rejects an invalid email address", () => {
    const result = contactSchema.safeParse({ ...valid, email: "not-an-email" });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid phone number", () => {
    const result = contactSchema.safeParse({ ...valid, phone: "call me" });

    expect(result.success).toBe(false);
  });

  it("rejects an unknown inquiry type", () => {
    const result = contactSchema.safeParse({ ...valid, inquiryType: "unknown" });

    expect(result.success).toBe(false);
  });

  it("rejects a message that is too short", () => {
    const result = contactSchema.safeParse({ ...valid, message: "Too short" });

    expect(result.success).toBe(false);
  });

  it("accepts a filled honeypot so the server can discard it silently", () => {
    const result = contactSchema.safeParse({ ...valid, website: "https://spam.example" });

    expect(result.success).toBe(true);
  });
});
