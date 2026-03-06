import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface NavbarProps {
  onJoinWaitlist: () => void;
}

export function Navbar({ onJoinWaitlist }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "About ICP", href: "#icp" },
  ];

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[oklch(0.1_0.015_260_/_0.9)] backdrop-blur-xl border-b border-[oklch(0.3_0.04_255_/_0.5)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <a href="#top" className="flex items-center">
            <img
              src="/assets/uploads/Oneprompt.ai-LogoSite-1.png"
              alt="OnePrompt.ai"
              className="h-20 w-auto object-contain"
            />
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                data-ocid="nav.link"
                href={link.href}
                className="px-4 py-2 text-sm font-body font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              data-ocid="nav.primary_button"
              onClick={onJoinWaitlist}
              className="btn-glow text-[oklch(0.07_0.02_250)] font-semibold text-sm px-5 h-9"
            >
              Join Waitlist
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden text-muted-foreground hover:text-foreground p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-[oklch(0.1_0.015_260_/_0.98)] backdrop-blur-xl border-b border-[oklch(0.3_0.04_255_/_0.5)] px-4 pb-4"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              data-ocid="nav.link"
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-sm font-body font-medium text-muted-foreground hover:text-foreground border-b border-[oklch(0.3_0.04_255_/_0.3)]"
            >
              {link.label}
            </a>
          ))}
          <Button
            data-ocid="nav.primary_button"
            onClick={() => {
              setMenuOpen(false);
              onJoinWaitlist();
            }}
            className="btn-glow text-[oklch(0.07_0.02_250)] font-semibold w-full mt-4 h-10"
          >
            Join Waitlist
          </Button>
        </motion.div>
      )}
    </motion.header>
  );
}
