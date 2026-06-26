import { createFileRoute } from "@tanstack/react-router";

import { ContactPage } from "@/routes/aloqa";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => buildSeoMeta({ locale: "uz", page: "contact" }),
  component: ContactPage,
});
