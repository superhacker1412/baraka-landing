import { createFileRoute } from "@tanstack/react-router";

import { RolePage } from "@/components/RolePage";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/for-shops")({
  head: () => buildSeoMeta({ locale: "uz", page: "forShops" }),
  component: () => <RolePage role="shops" />,
});
