"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Upload,
  X,
  Palette,
  Building2,
  Tag,
} from "lucide-react";

type TemplateState = {
  institutionName: string;
  institutionLogoUrl: string;
  courseName: string;
  recipientPlaceholder: string;
  dateFormat: string;
  instructorName: string;
  additionalText: string;
  approvedBy: string;
  skills: string[];
  newSkill: string;
};

const defaultState: TemplateState = {
  institutionName: "Kulmis Academy",
  institutionLogoUrl: "",
  courseName: "Advanced UX Design Principles",
  recipientPlaceholder: "{student_name}",
  dateFormat: "MMMM d, yyyy",
  instructorName: "Dr. Sarah Johnson",
  additionalText: "has successfully completed the curriculum and demonstrated excellence.",
  approvedBy: "Academic Director",
  skills: ["Front-end", "Back-end", "UX Research"],
  newSkill: "",
};

export default function CertificateTemplateDesignerPage() {
  const [activeTab, setActiveTab] = useState<"templates" | "saved">("templates");
  const [s, setS] = useState<TemplateState>(defaultState);

  const addSkill = () => {
    const v = s.newSkill.trim();
    if (v && !s.skills.includes(v)) setS((prev) => ({ ...prev, skills: [...prev.skills, v], newSkill: "" }));
  };
  const removeSkill = (skill: string) => setS((prev) => ({ ...prev, skills: prev.skills.filter((x) => x !== skill) }));

  const inputClass =
    "w-full rounded-xl border border-[var(--border)] bg-[var(--background)]/80 px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]/50";
  const labelClass = "mb-1 block text-xs font-medium text-[var(--muted)]";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/certificates" className="text-sm text-[var(--muted)] hover:text-[var(--primary)]">← Certificates</Link>
          <h1 className="mt-1 text-xl font-bold text-[var(--foreground)] sm:text-2xl">Certificate Template Designer</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">Customize the colors and layout of your certificate.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        {/* Left: Template Designer sidebar */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.9)] backdrop-blur-xl">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
            <Palette className="h-4 w-4 text-[var(--primary)]" />
            Template Designer
          </h2>
          <p className="mt-1 text-xs text-[var(--muted)]">Edit fields below; preview updates live.</p>

          <div className="mt-4 flex rounded-lg bg-[var(--background)]/60 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("templates")}
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === "templates" ? "bg-[var(--primary)]/20 text-[var(--primary)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              Templates
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("saved")}
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === "saved" ? "bg-[var(--primary)]/20 text-[var(--primary)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              Saved
            </button>
          </div>

          <div className="mt-6 space-y-4 overflow-y-auto max-h-[calc(100vh-320px)]">
            <div>
              <label className={labelClass}>Institution Logo</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Logo URL (optional)"
                  value={s.institutionLogoUrl}
                  onChange={(e) => setS((p) => ({ ...p, institutionLogoUrl: e.target.value }))}
                  className={inputClass}
                />
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--background)]/80 text-[var(--muted)]">
                  <Upload className="h-4 w-4" />
                </span>
              </div>
            </div>
            <div>
              <label className={labelClass}>Institution Name</label>
              <input
                type="text"
                value={s.institutionName}
                onChange={(e) => setS((p) => ({ ...p, institutionName: e.target.value }))}
                className={inputClass}
                placeholder="e.g. Kulmis Academy"
              />
            </div>
            <div>
              <label className={labelClass}>Course Name</label>
              <input
                type="text"
                value={s.courseName}
                onChange={(e) => setS((p) => ({ ...p, courseName: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Recipient Placeholder</label>
              <input
                type="text"
                value={s.recipientPlaceholder}
                onChange={(e) => setS((p) => ({ ...p, recipientPlaceholder: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Completion Date Format</label>
              <input
                type="text"
                value={s.dateFormat}
                onChange={(e) => setS((p) => ({ ...p, dateFormat: e.target.value }))}
                className={inputClass}
                placeholder="e.g. MMMM d, yyyy"
              />
            </div>
            <div>
              <label className={labelClass}>Instructor Name</label>
              <input
                type="text"
                value={s.instructorName}
                onChange={(e) => setS((p) => ({ ...p, instructorName: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Additional Text</label>
              <textarea
                value={s.additionalText}
                onChange={(e) => setS((p) => ({ ...p, additionalText: e.target.value }))}
                className={`${inputClass} min-h-[80px] resize-y`}
                rows={3}
              />
            </div>
            <div>
              <label className={labelClass}>Skills (pills)</label>
              <div className="flex flex-wrap gap-2">
                {s.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 rounded-full border border-[var(--primary)]/40 bg-[var(--primary)]/10 px-3 py-1 text-xs text-[var(--primary)]"
                  >
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} className="hover:opacity-80" aria-label={`Remove ${skill}`}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={s.newSkill}
                  onChange={(e) => setS((p) => ({ ...p, newSkill: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  className={inputClass}
                  placeholder="Add skill"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="rounded-xl border border-[var(--primary)]/50 bg-[var(--primary)]/10 px-3 py-2 text-sm font-medium text-[var(--primary)] hover:bg-[var(--primary)]/20"
                >
                  <Tag className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div>
              <label className={labelClass}>Approved by</label>
              <input
                type="text"
                value={s.approvedBy}
                onChange={(e) => setS((p) => ({ ...p, approvedBy: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Right: Live certificate preview */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.9)] backdrop-blur-xl">
          <p className="mb-4 text-xs text-[var(--muted)]">Live preview</p>
          <div
            className="mx-auto flex max-w-2xl flex-col items-center justify-center rounded-2xl border-2 border-[var(--cert-border)] bg-[var(--cert-bg)] p-8 text-center shadow-[var(--shadow-lg)]"
            style={{ minHeight: 420 }}
          >
            {s.institutionLogoUrl ? (
              <img src={s.institutionLogoUrl} alt="" className="h-12 w-auto object-contain" onError={(e) => (e.currentTarget.style.display = "none")} />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)]">
                <Building2 className="h-6 w-6 text-[var(--muted)]" />
              </div>
            )}
            <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-[var(--primary)]">{s.institutionName}</p>
            <p className="text-xs text-[var(--muted)]">Online Learning Platform</p>
            <h2 className="mt-6 text-xl font-bold text-[var(--foreground)]">Certificate of Completion</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">This is to certify that</p>
            <p className="mt-2 text-2xl font-bold text-[var(--primary)]">{s.recipientPlaceholder}</p>
            <p className="mt-4 max-w-md text-sm text-[var(--muted)]">{s.additionalText}</p>
            <p className="mt-3 text-lg font-semibold text-[var(--primary)]">{s.courseName}</p>
            <div className="mt-8 flex w-full max-w-sm justify-between border-t border-[var(--border)] pt-6">
              <div>
                <p className="text-xs text-[var(--muted)]">{s.approvedBy}</p>
                <p className="text-xs text-[var(--foreground)]">_________________</p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted)]">Instructor: {s.instructorName}</p>
                <p className="text-xs text-[var(--foreground)]">_________________</p>
              </div>
            </div>
            {s.skills.length > 0 && (
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {s.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-[var(--secondary)]/40 bg-[var(--secondary)]/10 px-3 py-1 text-xs text-[var(--secondary)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
