import { createFileRoute } from "@tanstack/react-router";

import { PreRegistrationPage } from "@/routes/oldindan-royxat";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/pre-registration")({
  head: () => buildSeoMeta({ locale: "uz", page: "preRegistration" }),
  component: PreRegistrationPage,
});
