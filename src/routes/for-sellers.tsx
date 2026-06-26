import { createFileRoute } from "@tanstack/react-router";

import { RolePage } from "@/components/RolePage";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/for-sellers")({
  head: () => buildSeoMeta({ locale: "uz", page: "forSellers" }),
  component: () => <RolePage role="sellers" />,
});
