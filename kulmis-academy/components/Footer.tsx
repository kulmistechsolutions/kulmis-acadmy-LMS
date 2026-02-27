import Link from "next/link";

const PHONE = "+252615331712";
const WHATSAPP = "+252613609678";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP.replace(/\D/g, "")}`;
const TEL_LINK = `tel:${PHONE}`;

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]/40 py-8 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="text-center sm:text-left">
            <span className="text-sm text-[var(--muted)]">
              © {new Date().getFullYear()} Kulmis Academy. All rights reserved.
            </span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link
              href="/dashboard"
              className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--primary)]"
            >
              Dashboard
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--primary)]"
            >
              Pricing
            </Link>
            <Link
              href="#courses"
              className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--primary)]"
            >
              Courses
            </Link>
          </nav>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <span className="text-xs font-medium uppercase tracking-wide text-[var(--muted)] sm:text-sm">
              Contact
            </span>
            <a
              href={TEL_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)]/60 px-3 py-2 text-sm text-[var(--foreground)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
            >
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call
            </a>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)]/60 px-3 py-2 text-sm text-[var(--foreground)] transition-colors hover:border-[#25D366] hover:text-[#25D366]"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2 text-xs text-[var(--muted)] sm:justify-start">
          <a href={TEL_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--primary)]">
            {PHONE}
          </a>
          <span aria-hidden>·</span>
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--primary)]">
            {WHATSAPP}
          </a>
        </div>
      </div>
    </footer>
  );
}
