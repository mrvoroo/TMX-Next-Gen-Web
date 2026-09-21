'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { cn } from '@/lib/utils';

const NAV_ANCHORS = [
  { key: 'nav.home' as const, href: '#hero' },
  { key: 'nav.services' as const, href: '#services' },
  { key: 'nav.about' as const, href: '#about' },
  { key: 'nav.portfolio' as const, href: '#portfolio' },
  { key: 'nav.contact' as const, href: '#contact' },
];

export function Header() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Scroll detection for header background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          scrolled || menuOpen
            ? 'border-b border-white/10 bg-[#050508]/90 backdrop-blur-xl'
            : 'bg-transparent',
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          {/* Logo */}
          <Link
            href="#hero"
            onClick={closeMenu}
            className="gradient-text text-xl font-black tracking-tight"
            aria-label="TMX — zur Startseite"
          >
            TMX
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden items-center gap-8 md:flex"
            aria-label="Hauptnavigation"
          >
            {NAV_ANCHORS.map(({ key, href }) => (
              <a
                key={key}
                href={href}
                className="text-sm font-medium text-white/60 transition-colors duration-200 hover:text-white"
              >
                {t(key)}
              </a>
            ))}
          </nav>

          {/* Right side: toggle + hamburger */}
          <div className="flex items-center gap-3">
            <LanguageToggle />

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white md:hidden"
              aria-label={menuOpen ? 'Menü schließen' : 'Menü öffnen'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {menuOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X size={20} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu size={20} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 flex flex-col bg-[#050508]/97 pt-20 backdrop-blur-xl md:hidden"
          >
            <nav
              className="flex flex-col items-center gap-1 px-6 pt-8"
              aria-label="Mobile Navigation"
            >
              {NAV_ANCHORS.map(({ key, href }, i) => (
                <motion.a
                  key={key}
                  href={href}
                  onClick={closeMenu}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.25 }}
                  className="w-full rounded-xl px-6 py-4 text-center text-2xl font-semibold text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {t(key)}
                </motion.a>
              ))}
            </nav>

            {/* Accent divider */}
            <div className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-violet-600 to-cyan-500 opacity-40" />

            {/* Social / legal links in mobile menu */}
            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-white/30">
              <a href="#contact" onClick={closeMenu} className="hover:text-white/60 transition-colors">
                {t('footer.impressum')}
              </a>
              <span>·</span>
              <a href="#contact" onClick={closeMenu} className="hover:text-white/60 transition-colors">
                {t('footer.datenschutz')}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
