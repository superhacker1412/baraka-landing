import { createFileRoute } from "@tanstack/react-router";

import { RolePage } from "@/components/RolePage";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/for-suppliers")({
  head: () => buildSeoMeta({ locale: "uz", page: "forSuppliers" }),
  component: () => <RolePage role="suppliers" />,
});
