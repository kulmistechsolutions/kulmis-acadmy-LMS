"use client";

import Link from "next/link";

type LogoProps = {
  /** "full" = icon + text (default), "icon" = icon only, "compact" = smaller for sidebars */
  variant?: "full" | "icon" | "compact";
  /** Wrap in Link to home (default true). Set false for static use (e.g. sign-in page). */
  href?: string | null;
  className?: string;
  onClick?: () => void;
};

export function Logo({ variant = "full", href = "/", className = "", onClick }: LogoProps) {
  const isCompact = variant === "compact";
  const isIconOnly = variant === "icon";

  const iconSize = isCompact ? "w-8 h-8" : "w-10 h-10";
  const textSize = isCompact ? "text-base" : "text-xl";

  const icon = (
    <div
      className={`${iconSize} shrink-0 rounded-lg flex items-center justify-center font-bold text-[var(--primary-contrast)] transition-transform duration-300 group-hover:scale-105`}
      style={{
        background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
        boxShadow: "0 0 20px rgba(0, 240, 255, 0.4)",
      }}
    >
      <span className={isCompact ? "text-sm" : "text-lg"}>KA</span>
    </div>
  );

  const text = (
    <div className={`${textSize} font-bold tracking-tight`}>
      <span className="text-[var(--foreground)]">Kulmis </span>
      <span
        className="bg-clip-text text-transparent"
        style={{
          backgroundImage: "linear-gradient(90deg, var(--primary), var(--tertiary))",
        }}
      >
        Academy
      </span>
    </div>
  );

  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {icon}
      {!isIconOnly && text}
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group flex items-center"
        aria-label="Kulmis Academy – Home"
        onClick={onClick}
      >
        {content}
      </Link>
    );
  }

  return <span className="flex items-center">{content}</span>;
}
