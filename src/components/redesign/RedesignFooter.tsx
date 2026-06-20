import Link from "next/link";
import { Phone } from "lucide-react";
import { BrandLogo } from "@/components/redesign/BrandLogo";
import { REDesign_CONTACT, REDesign_FOOTER_NAV } from "@/lib/redesign/navigation";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export function RedesignFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#2d4a22] px-4 py-12 text-white md:px-6 md:py-14">
      <div className="mx-auto max-w-6xl">
        <BrandLogo variant="onDark" className="mb-4" />
        <p className="max-w-md text-[15px] leading-relaxed text-white/75">
          Transformamos espacios a través del diseño sostenible y la ingeniería ecológica.
        </p>

        <div className="mt-10 grid gap-10 sm:grid-cols-2 md:max-w-xl">
          <div>
            <h2 className="font-display text-base font-semibold text-[#c4933f]">Navegación</h2>
            <ul className="mt-4 space-y-2">
              {REDesign_FOOTER_NAV.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[15px] text-white/80 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-base font-semibold text-[#c4933f]">Contacto</h2>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={REDesign_CONTACT.phoneHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[15px] text-white/80 transition-colors hover:text-white"
                >
                  <Phone className="h-4 w-4 shrink-0 text-[#c4933f]" aria-hidden />
                  {REDesign_CONTACT.phone}
                </a>
              </li>
            </ul>
            <div className="mt-5 flex gap-3">
              <a
                href={REDesign_CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/15"
                aria-label="Instagram de Jardinería GV"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <p className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/50 sm:text-left">
          © {year} Jardinería GV. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
