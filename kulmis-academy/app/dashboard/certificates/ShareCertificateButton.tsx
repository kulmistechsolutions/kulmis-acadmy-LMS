"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";

export function ShareCertificateButton({ verifyUrl }: { verifyUrl: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(verifyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.open(verifyUrl, "_blank");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--primary)]/50 bg-[var(--primary)]/10 px-4 py-3 text-sm font-medium text-[var(--primary)] hover:bg-[var(--primary)]/20 sm:w-auto"
    >
      <Share2 className="h-4 w-4" />
      {copied ? "Copied!" : "Share public link"}
    </button>
  );
}
