import { createFileRoute, redirect } from "@tanstack/react-router";

// Legacy URL kept working for bookmarks and search results.
export const Route = createFileRoute("/products/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/software/$slug", params: { slug: params.slug }, statusCode: 301 });
  },
});
