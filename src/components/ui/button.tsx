import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-opacity disabled:pointer-events-none disabled:opacity-50",
        variant === "default" &&
          "bg-primary text-primary-foreground shadow-sm shadow-primary/15 hover:opacity-90",
        variant === "outline" && "border border-border bg-card hover:bg-accent",
        variant === "ghost" && "hover:bg-accent",
        size === "default" && "px-5 py-2.5 text-[13.5px]",
        size === "sm" && "px-3.5 py-1.5 text-[12.5px]",
        size === "lg" && "px-6 py-3 text-[14px]",
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
