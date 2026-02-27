"use client";

export function NeonBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[var(--background)]">
      {/* Soft neon orbs */}
      <div
        className="absolute -left-[20%] top-[10%] h-[480px] w-[480px] rounded-full blur-[110px]"
        style={{
          background: "var(--primary)",
          opacity: 0.1,
          animation: "neon-float-1 20s ease-in-out infinite, neon-glow 6s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -right-[12%] top-[38%] h-[380px] w-[380px] rounded-full blur-[95px]"
        style={{
          background: "var(--secondary)",
          opacity: 0.09,
          animation: "neon-float-2 24s ease-in-out infinite, neon-glow 7s ease-in-out infinite 0.8s",
        }}
      />
      <div
        className="absolute bottom-[22%] left-[28%] h-[320px] w-[320px] rounded-full blur-[85px]"
        style={{
          background: "var(--tertiary)",
          opacity: 0.08,
          animation: "neon-float-3 22s ease-in-out infinite, neon-glow 5.5s ease-in-out infinite 1.2s",
        }}
      />

      {/* Technology grid - neon blueprint style */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(var(--primary) 1px, transparent 1px),
            linear-gradient(90deg, var(--primary) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Diagonal tech lines - neon accent */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 80px,
            var(--primary) 80px,
            var(--primary) 81px
          )`,
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 80px,
            var(--secondary) 80px,
            var(--secondary) 81px
          )`,
        }}
      />

      {/* Horizontal scan lines - tech feel */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            var(--primary) 2px,
            var(--primary) 3px
          )`,
        }}
      />

      {/* Corner brackets / HUD accent - subtle neon frame (smaller on mobile) */}
      <div className="absolute left-0 top-0 h-14 w-14 border-l-2 border-t-2 border-[var(--primary)] opacity-20 sm:h-20 sm:w-20 lg:h-24 lg:w-24" />
      <div className="absolute right-0 top-0 h-14 w-14 border-r-2 border-t-2 border-[var(--primary)] opacity-20 sm:h-20 sm:w-20 lg:h-24 lg:w-24" />
      <div className="absolute bottom-0 left-0 h-14 w-14 border-b-2 border-l-2 border-[var(--primary)] opacity-20 sm:h-20 sm:w-20 lg:h-24 lg:w-24" />
      <div className="absolute bottom-0 right-0 h-14 w-14 border-b-2 border-r-2 border-[var(--primary)] opacity-20 sm:h-20 sm:w-20 lg:h-24 lg:w-24" />
    </div>
  );
}
