import { createFileRoute } from "@tanstack/react-router";

import { RolePage } from "@/components/RolePage";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/for-couriers")({
  head: () => buildSeoMeta({ locale: "uz", page: "forCouriers" }),
  component: () => <RolePage role="couriers" />,
});
