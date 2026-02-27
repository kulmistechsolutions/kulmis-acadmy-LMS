"use client";

import { useState } from "react";

type CertificateFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
  alreadyIssued?: boolean;
  certificateId?: string | null;
  onSuccess?: () => void;
};

export function CertificateFormModal({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  alreadyIssued = false,
  certificateId = null,
  onSuccess,
}: CertificateFormModalProps) {
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [issuedCertificateId, setIssuedCertificateId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!fullName.trim()) {
      setError("Full name is required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/certificate/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          courseTitle,
          fullName: fullName.trim(),
          studentId: studentId.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to generate certificate");
      }
      const blob = await res.blob();
      const certIdFromHeader = res.headers.get("X-Certificate-Id");
      if (certIdFromHeader) setIssuedCertificateId(certIdFromHeader);
      const disposition = res.headers.get("Content-Disposition");
      const match = disposition?.match(/filename="(.+)"/);
      const filename = match ? match[1] : "Kulmis-Academy-Certificate.pdf";
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      setDone(true);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDone(false);
    setError(null);
    setIssuedCertificateId(null);
    onClose();
  };

  const certId = issuedCertificateId ?? certificateId ?? null;
  const verifyUrl = certId ? `${typeof window !== "undefined" ? window.location.origin : ""}/verify/${certId}` : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_0_40px_rgba(0,240,255,0.1)] sm:p-6">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">
          {alreadyIssued ? "Download Certificate" : "Get Certificate"}
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {alreadyIssued
            ? "Your certificate was already issued. Generate PDF again to download."
            : "Confirm your details to generate your certificate."}
        </p>

        {done ? (
          <div className="mt-6 space-y-4">
            <p className="text-sm font-medium text-[var(--primary)]">
              ✓ Certificate generated. Check your downloads.
            </p>
            {verifyUrl && (
              <a
                href={verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg border border-[var(--primary)]/50 bg-[var(--primary)]/10 px-4 py-2 text-center text-sm text-[var(--primary)] hover:bg-[var(--primary)]/20"
              >
                View verification page
              </a>
            )}
            <button
              type="button"
              onClick={handleClose}
              className="w-full rounded-lg bg-[var(--primary)] py-2 text-sm font-medium text-[var(--primary-contrast)]"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)]">
                Full name <span className="text-[var(--tertiary)]">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)]">
                Course name
              </label>
              <input
                type="text"
                value={courseTitle}
                readOnly
                className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--border)]/30 px-4 py-2 text-[var(--muted)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)]">
                Student ID <span className="text-[var(--muted)]">(optional)</span>
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Optional"
                className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:outline-none"
              />
            </div>
            <p className="text-xs text-[var(--muted)]">
              Completion date and certificate ID will be added automatically.
            </p>
            {error && <p className="text-sm text-[var(--tertiary)]">{error}</p>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 rounded-lg border border-[var(--border)] py-2 text-sm font-medium text-[var(--foreground)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-[var(--primary)] py-2 text-sm font-medium text-[var(--primary-contrast)] hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Generating…" : alreadyIssued ? "Download PDF" : "Generate Certificate"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
