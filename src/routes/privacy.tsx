import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Eyercall" },
      {
        name: "description",
        content: "How Eyercall handles information submitted through this website.",
      },
      { property: "og:title", content: "Privacy Policy | Eyercall" },
      {
        property: "og:description",
        content: "How Eyercall handles information submitted through this website.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <section className="page-shell pb-10 pt-40">
      <div className="max-w-3xl">
        <h1 className="text-5xl font-semibold">Privacy Policy</h1>
        <div className="mt-10 space-y-6 rounded-3xl glass card-hover p-8 text-muted-foreground">
          <p>
            This website collects only the information you choose to submit through the contact
            form: your name, email, phone number (optional), the type of inquiry, and your message.
          </p>
          <p>
            That information is used solely to respond to your enquiry. It is not sold or shared for
            advertising.
          </p>
          <p>
            You may ask Eyercall to update or delete information you have submitted by getting in
            touch through the contact page.
          </p>
        </div>
      </div>
    </section>
  ),
});
