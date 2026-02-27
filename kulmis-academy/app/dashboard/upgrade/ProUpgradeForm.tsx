"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Check, X, Upload, MessageCircle } from "lucide-react";
import { proPaymentConfig } from "@/lib/pro-config";

type ProUpgradeFormProps = {
  userEmail: string;
};

export function ProUpgradeForm({ userEmail }: ProUpgradeFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentNumber, setPaymentNumber] = useState("");
  const [proofImageUrl, setProofImageUrl] = useState<string | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const type = file.type?.toLowerCase();
    if (!type || !["image/jpeg", "image/jpg", "image/png"].includes(type)) {
      setError("Only JPG and PNG images are allowed.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be 2MB or smaller.");
      return;
    }
    setError(null);
    setProofFile(file);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload/proof", {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Upload failed.");
        setProofFile(null);
        return;
      }
      setProofImageUrl(data.url ?? null);
    } catch {
      setError("Upload failed.");
      setProofFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!fullName.trim() || !phone.trim() || !paymentNumber.trim()) {
      setError("Full name, phone, and payment number are required.");
      return;
    }
    if (!proofImageUrl) {
      setError("Please upload a proof image.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          paymentNumber: paymentNumber.trim(),
          proofImageUrl,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Request failed.");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-[var(--border)] bg-[var(--background)]/80 px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]/50 transition-all duration-300";
  const labelClass = "mb-2 block text-sm font-medium text-[var(--foreground)]";

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]/90 p-4 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow-lg)] text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
            <Check className="h-8 w-8" strokeWidth={2.5} />
          </div>
          <h2 className="mt-6 text-xl font-bold text-[var(--foreground)]">
            Your request has been submitted successfully.
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Please contact our support number to confirm your payment.
          </p>
          <div className="mt-6 space-y-3">
            <p className="text-sm font-medium text-[var(--foreground)]">
              Support:{" "}
              <a
                href={`tel:${proPaymentConfig.supportPhone.replace(/\s/g, "")}`}
                className="text-[var(--primary)] hover:underline"
              >
                {proPaymentConfig.supportPhone}
              </a>
            </p>
            <a
              href={proPaymentConfig.supportWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-medium text-white transition-all hover:opacity-90"
            >
              <MessageCircle className="h-5 w-5" />
              Contact on WhatsApp
            </a>
            <Link
              href="/dashboard"
              className="mt-4 block w-full rounded-xl border border-[var(--primary)]/50 bg-[var(--primary)]/10 py-3 text-sm font-medium text-[var(--primary)] transition-all hover:bg-[var(--primary)]/20"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-6 shadow-[var(--shadow-lg)] backdrop-blur sm:p-8">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Upgrade to Pro</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Fill in your details and payment proof. We&apos;ll activate Pro after verification.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="fullName" className={labelClass}>
            Full Name <span className="text-[var(--tertiary)]">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={inputClass}
            placeholder="Your full name"
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone Number <span className="text-[var(--tertiary)]">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
            placeholder="e.g. 061 123 4567"
          />
        </div>
        <div>
          <label htmlFor="paymentNumber" className={labelClass}>
            Payment Number Used <span className="text-[var(--tertiary)]">*</span>
          </label>
          <input
            id="paymentNumber"
            type="text"
            required
            value={paymentNumber}
            onChange={(e) => setPaymentNumber(e.target.value)}
            className={inputClass}
            placeholder="Number you used to pay"
          />
        </div>
        <div>
          <label className={labelClass}>
            Upload Proof Image <span className="text-[var(--tertiary)]">*</span>
          </label>
          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--background)]/50 py-6 text-sm text-[var(--muted)] transition-all hover:border-[var(--primary)]/50 hover:bg-[var(--background)]/80 disabled:opacity-50"
            >
              <Upload className="h-5 w-5" />
              {uploading ? "Uploading…" : "Choose JPG or PNG (max 2MB)"}
            </button>
            {proofImageUrl && (
              <div className="relative mt-2 h-32 w-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)]/50">
                <Image
                  src={proofImageUrl}
                  alt="Proof"
                  fill
                  className="object-contain"
                />
                <button
                  type="button"
                  onClick={() => {
                    setProofImageUrl(null);
                    setProofFile(null);
                  }}
                  className="absolute right-2 top-2 rounded-full bg-[var(--surface)]/90 p-1.5 text-[var(--muted)] hover:bg-[var(--tertiary)] hover:text-white"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/5 p-4">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">Payment instructions</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Company payment number: <strong className="text-[var(--foreground)]">{proPaymentConfig.companyPaymentNumber}</strong>
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Amount: <strong className="text-[var(--foreground)]">{proPaymentConfig.paymentAmount}</strong>
          </p>
          <p className="mt-2 text-xs text-[var(--muted)]">{proPaymentConfig.instructions}</p>
        </div>

        {error && (
          <p className="text-sm text-[var(--tertiary)]">{error}</p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 rounded-xl bg-[var(--primary)] py-3 text-sm font-medium text-[var(--primary-contrast)] transition-all hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Submitting…" : "Submit Request"}
          </button>
          <Link
            href="/dashboard"
            className="flex-1 rounded-xl border border-[var(--border)] py-3 text-center text-sm font-medium text-[var(--foreground)] transition-all hover:bg-[var(--border)]/30"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
