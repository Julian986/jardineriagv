import Link from "next/link";
import { Sprout } from "lucide-react";

type BrandLogoProps = {
  /** dark = header sobre fondo claro; onDark = drawer/footer sobre verde */
  variant?: "dark" | "onDark";
  size?: "sm" | "md";
  className?: string;
  href?: string;
  onClick?: () => void;
};

function BrandMark({
  variant = "dark",
  size = "md",
}: {
  variant?: "dark" | "onDark";
  size?: "sm" | "md";
}) {
  const box = size === "sm" ? "h-9 w-9" : "h-10 w-10";
  const icon = size === "sm" ? "h-[18px] w-[18px]" : "h-5 w-5";

  const shell =
    variant === "onDark"
      ? "bg-white shadow-sm"
      : "bg-[#2d5016] shadow-sm ring-1 ring-black/5";

  const iconClass = variant === "onDark" ? "text-[#2d5016]" : "text-white";

  return (
    <span
      className={`flex ${box} shrink-0 items-center justify-center rounded-full ${shell}`}
      aria-hidden
    >
      <Sprout className={`${icon} ${iconClass}`} strokeWidth={2.25} />
    </span>
  );
}

export function BrandLogo({
  variant = "dark",
  size = "md",
  className = "",
  href = "/",
  onClick,
}: BrandLogoProps) {
  const textClass = variant === "onDark" ? "text-white" : "text-[#2d5016]";
  const textSize = size === "sm" ? "text-lg" : "text-xl";
  const accentClass = variant === "onDark" ? "text-white" : "text-[#c4933f]";

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`inline-flex min-w-0 items-center gap-3 ${className}`}
      aria-label="Jardinería GV — Inicio"
    >
      <BrandMark variant={variant} size={size} />
      <span
        className={`font-display ${textSize} font-bold leading-none tracking-tight ${textClass}`}
      >
        Jardinería<span className={accentClass}>GV</span>
      </span>
    </Link>
  );
}

export { BrandMark };
