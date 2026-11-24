import { createFileRoute, redirect } from "@tanstack/react-router";

// Legacy URL kept working for bookmarks and search results.
export const Route = createFileRoute("/products/")({
  beforeLoad: () => {
    throw redirect({ to: "/software", statusCode: 301 });
  },
});
