"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor, Check } from "lucide-react";

type ThemeValue = "light" | "dark" | "system";

const options: { value: ThemeValue; label: string; icon: React.ReactNode }[] = [
  { value: "light", label: "Light", icon: <Sun className="h-4 w-4" /> },
  { value: "dark", label: "Dark", icon: <Moon className="h-4 w-4" /> },
  { value: "system", label: "System", icon: <Monitor className="h-4 w-4" /> },
];

export function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const current: ThemeValue = (theme as ThemeValue) || "system";

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-xl border border-[var(--border)] bg-[var(--surface)]" aria-hidden />
    );
  }

  const effectiveTheme = resolvedTheme ?? "light";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] shadow-[var(--shadow)] transition-all duration-300 hover:border-[var(--primary)]/50 hover:shadow-[var(--shadow-lg)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
        aria-label="Toggle theme"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {effectiveTheme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-hidden
            className="fixed inset-0 z-[100]"
            onClick={() => setOpen(false)}
          />
          <div
            role="listbox"
            aria-label="Theme selection"
            className="absolute right-0 top-full z-[101] mt-2 w-40 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1 shadow-[var(--shadow-lg)] transition-opacity duration-200"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={current === opt.value}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setTheme(opt.value);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--background)]/80"
              >
                <span className="text-[var(--muted)]">{opt.icon}</span>
                <span className="flex-1 text-left">{opt.label}</span>
                {current === opt.value && (
                  <Check className="h-4 w-4 text-[var(--primary)]" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
