import { createFileRoute } from "@tanstack/react-router";

import { TariffPage } from "@/routes/tariff";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/pricing")({
  head: () => buildSeoMeta({ locale: "uz", page: "pricing" }),
  component: TariffPage,
});
