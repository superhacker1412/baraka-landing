import { cn } from "@/lib/utils";
import { BRAND_NAME, LOGO_PATH } from "@/lib/brand";

type BrandLogoProps = {
  className?: string;
};

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <img
      src={LOGO_PATH}
      alt={BRAND_NAME}
      className={cn("shrink-0 rounded-[10px] object-contain", className)}
    />
  );
}
