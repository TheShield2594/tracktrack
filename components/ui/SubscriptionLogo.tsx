import Image from "next/image";
import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface SubscriptionLogoProps {
  name: string;
  logoUrl?: string | null;
  color?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { container: "w-8 h-8 text-xs rounded-lg", img: 32 },
  md: { container: "w-10 h-10 text-sm rounded-xl", img: 40 },
  lg: { container: "w-14 h-14 text-lg rounded-2xl", img: 56 },
};

export function SubscriptionLogo({ name, logoUrl, color = "#6366f1", size = "md", className }: SubscriptionLogoProps) {
  const s = sizes[size];

  if (logoUrl) {
    return (
      <div className={cn("relative flex-shrink-0 overflow-hidden bg-white/5", s.container, className)}>
        <Image
          src={logoUrl}
          alt={name}
          width={s.img}
          height={s.img}
          className="w-full h-full object-contain p-1.5"
          unoptimized
        />
      </div>
    );
  }

  return (
    <div
      className={cn("flex-shrink-0 flex items-center justify-center font-semibold text-white", s.container, className)}
      style={{ backgroundColor: color + "33", border: `1px solid ${color}40` }}
    >
      <span style={{ color }}>{getInitials(name)}</span>
    </div>
  );
}
