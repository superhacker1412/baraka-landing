import { createFileRoute } from "@tanstack/react-router";

import { RolePage } from "@/components/RolePage";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/for-warehouses")({
  head: () => buildSeoMeta({ locale: "uz", page: "forWarehouses" }),
  component: () => <RolePage role="warehouses" />,
});
