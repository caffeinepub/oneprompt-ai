import { AdminPanel } from "@/components/AdminPanel";
import { CountUp } from "@/components/CountUp";
import { Navbar } from "@/components/Navbar";
import { WaitlistModal } from "@/components/WaitlistModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { useWaitlistCount } from "@/hooks/useQueries";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  GitBranch,
  Globe,
  Lock,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const MAX_SPOTS = 500;

const FEATURES = [
  {
    icon: BookOpen,
    title: "Store & Organize",
    description:
      "One private library for all your prompts and agentic workflows. Folders, tags, and full-text search.",
  },
  {
    icon: GitBranch,
    title: "Version Control",
    description:
      "Full history of every change with diff view. Revert to any previous version in one click.",
  },
  {
    icon: Shield,
    title: "On-Chain Security",
    description:
      "Your data lives on ICP blockchain — not a vendor's server. Cryptographically secured by design.",
  },
  {
    icon: Users,
    title: "Team Access",
    description:
      "Share prompts and workflows with your team. Fine-grained permission controls included.",
  },
  {
    icon: BarChart3,
    title: "Observability",
    description:
      "Track usage, performance, and outcomes across all your AI workflows in a unified dashboard.",
  },
  {
    icon: ClipboardList,
    title: "Compliance Ready",
    description:
      "Immutable audit trails, access logs, and export tools built in from the ground up.",
  },
];

const ICP_TRUST_POINTS = [
  {
    icon: Globe,
    title: "Fully Decentralized",
    description:
      "No central servers, no single point of failure. Your prompts are distributed across the ICP network.",
  },
  {
    icon: Lock,
    title: "Data Sovereignty",
    description:
      "You own your data entirely. No third party can access, sell, or lose your prompt library.",
  },
  {
    icon: Zap,
    title: "No Vendor Lock-In",
    description:
      "Blockchain-based persistence means your library persists regardless of any company's decisions.",
  },
];

const TICKER_ITEMS = [
  "247 teams joined",
  "Only 500 Early Access spots",
  "Powered by ICP Blockchain",
  "100% On-Chain",
  "Zero vendor lock-in",
  "Cryptographically secured",
  "Team-ready from day one",
  "Full version history",
];

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [ctaEmail, setCtaEmail] = useState("");
  const [initialEmail, setInitialEmail] = useState("");

  const { data: waitlistCount } = useWaitlistCount();
  const count = Number(waitlistCount ?? BigInt(0));
  const spotsRemaining = Math.max(0, MAX_SPOTS - count);

  const openModal = (prefillEmail?: string) => {
    setInitialEmail(prefillEmail ?? "");
    setModalOpen(true);
  };

  // CTA bottom form: collect email, open modal with it pre-filled
  const handleCtaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ctaEmail.trim()) return;
    openModal(ctaEmail.trim().toLowerCase());
    setCtaEmail("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body overflow-x-hidden">
      <Toaster />
      <Navbar
        onJoinWaitlist={() => openModal()}
        onAdminClick={() => setAdminOpen(true)}
      />
      <WaitlistModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        spotsRemaining={spotsRemaining}
        totalSpots={MAX_SPOTS}
        initialEmail={initialEmail}
      />
      <AdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} />

      {/* ── Hero Section ────────────────────────────────── */}
      <section
        data-ocid="hero.section"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img
            src="/assets/generated/hero-bg.dim_1600x900.jpg"
            alt=""
            className="w-full h-full object-cover"
            loading="eager"
          />
          {/* Darker, more dramatic overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.06_0.015_260_/_0.92)] via-[oklch(0.07_0.015_260_/_0.82)] to-[oklch(0.1_0.015_260)]" />
        </div>

        {/* Grid overlay — tighter, more intentional */}
        <div className="absolute inset-0 bg-grid opacity-25" />

        {/* Glow orbs — stronger, more directional */}
        <div className="absolute top-1/3 right-[15%] w-[480px] h-[480px] rounded-full bg-[oklch(0.55_0.22_250_/_0.12)] blur-[140px] pointer-events-none" />
        <div className="absolute top-1/4 left-[10%] w-[320px] h-[320px] rounded-full bg-[oklch(0.78_0.18_195_/_0.08)] blur-[100px] pointer-events-none" />

        {/* Content — tighter column, editorial spacing */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24">
          {/* Tier 1: Scarcity badge — tight, high-signal */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="flex justify-center mb-7"
          >
            <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-mono font-semibold tracking-wide bg-[oklch(0.78_0.18_195_/_0.12)] text-[oklch(0.88_0.16_190)] border border-[oklch(0.78_0.18_195_/_0.35)] pulse-glow uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.88_0.16_190)] dot-pulse flex-shrink-0" />
              Early Access · Limited Spots Available
            </span>
          </motion.div>

          {/* Tier 2: Headline — the hero moment */}
          {/* Power phrase first, modifier second — gradient on the memorable claim */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.75,
              delay: 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="font-display font-extrabold tracking-[-0.03em] leading-[1.02] mb-7"
            style={{ fontSize: "clamp(2.75rem, 7vw, 5rem)" }}
          >
            <span className="block text-foreground">
              Store. Version. Share.
            </span>
            <span className="block text-gradient-cyan mt-1">
              Your Prompts, On-Chain.
            </span>
          </motion.h1>

          {/* Tier 3: Subheadline — single crisp sentence, generous gap */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg sm:text-xl font-body leading-relaxed mb-10 mx-auto max-w-xl"
            style={{ color: "oklch(0.72 0.03 240)" }}
          >
            The private prompt library for AI teams — secured by blockchain,
            built for the way you actually work.
          </motion.p>

          {/* Tier 4: CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
          >
            <button
              type="button"
              data-ocid="hero.primary_button"
              onClick={() => openModal()}
              className="btn-glow-hero"
            >
              Reserve Early Access
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
            <a
              href="#features"
              className="flex items-center gap-1.5 text-sm font-body font-medium transition-colors"
              style={{ color: "oklch(0.58 0.04 240)" }}
            >
              Explore features
              <ChevronRight className="h-4 w-4" />
            </a>
          </motion.div>

          {/* Tier 5: Live capacity bar — the scarcity signal */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="max-w-sm mx-auto"
          >
            <div className="glass-card rounded-2xl px-5 py-4 border border-[oklch(0.35_0.05_240_/_0.35)]">
              {/* Progress bar */}
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-mono font-semibold text-[oklch(0.88_0.16_190)] uppercase tracking-wider">
                  Spots claimed
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  <span className="text-[oklch(0.88_0.16_190)] font-bold">
                    <CountUp end={count > 0 ? count : 247} />
                  </span>
                  {" / "}
                  {MAX_SPOTS}
                </span>
              </div>
              <div className="h-1.5 w-full bg-[oklch(0.2_0.03_255)] rounded-full overflow-hidden">
                <div
                  className="capacity-bar-fill h-full"
                  style={{
                    width: `${Math.min(100, ((count > 0 ? count : 247) / MAX_SPOTS) * 100)}%`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between mt-2.5">
                <div className="flex -space-x-1.5">
                  {["A", "B", "C", "D"].map((l) => (
                    <div
                      key={l}
                      className="w-5 h-5 rounded-full bg-gradient-to-br from-[oklch(0.55_0.22_250)] to-[oklch(0.78_0.18_195)] border border-background flex items-center justify-center text-[8px] font-bold text-[oklch(0.07_0.02_250)]"
                    >
                      {l}
                    </div>
                  ))}
                </div>
                <span
                  className="text-xs font-body"
                  style={{ color: "oklch(0.55 0.04 240)" }}
                >
                  <span className="text-[oklch(0.75_0.12_30)] font-semibold">
                    {spotsRemaining} spots left
                  </span>{" "}
                  — don't wait
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-[oklch(0.35_0.04_250_/_0.4)] rounded-full flex justify-center pt-1.5">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{
                duration: 1.6,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="w-1.5 h-1.5 rounded-full bg-[oklch(0.78_0.18_195)]"
            />
          </div>
        </motion.div>
      </section>

      {/* ── Scarcity / Social Proof Bar ─────────────────── */}
      <section
        data-ocid="proof.section"
        className="border-y border-[oklch(0.25_0.03_255)] bg-[oklch(0.12_0.02_255_/_0.5)] overflow-hidden py-4"
      >
        <div className="ticker-track select-none">
          {[
            ...TICKER_ITEMS.map((t, i) => `a${i}:${t}`),
            ...TICKER_ITEMS.map((t, i) => `b${i}:${t}`),
          ].map((item) => (
            <span
              key={item}
              className="flex items-center gap-3 px-8 text-sm font-mono text-[oklch(0.65_0.08_220)] whitespace-nowrap"
            >
              <span className="h-1 w-1 rounded-full bg-[oklch(0.78_0.18_195)]" />
              {item.replace(/^[ab]\d+:/, "")}
            </span>
          ))}
        </div>
      </section>

      {/* ── Features Grid ───────────────────────────────── */}
      <section
        id="features"
        data-ocid="features.section"
        className="py-28 px-4 sm:px-6 lg:px-8 relative"
      >
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[oklch(0.55_0.22_250_/_0.05)] blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-mono font-medium text-[oklch(0.78_0.18_195)] uppercase tracking-widest mb-4 block">
              Platform Features
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Everything You Need to
              <br />
              <span className="text-gradient-cyan">Manage Prompts</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto font-body">
              From solo developers to enterprise teams — one platform for your
              entire AI workflow library.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  data-ocid={`features.item.${i + 1}`}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="glass-card glass-card-hover rounded-2xl p-6 group"
                >
                  <div className="mb-4 inline-flex p-2.5 rounded-xl bg-[oklch(0.78_0.18_195_/_0.1)] border border-[oklch(0.78_0.18_195_/_0.2)] group-hover:bg-[oklch(0.78_0.18_195_/_0.15)] transition-colors">
                    <Icon className="h-5 w-5 text-[oklch(0.78_0.18_195)]" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm font-body leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Product Preview ─────────────────────────────── */}
      <section
        id="how-it-works"
        data-ocid="preview.section"
        className="py-28 px-4 sm:px-6 lg:px-8 bg-[oklch(0.09_0.015_260)]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Copy */}
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-xs font-mono font-medium text-[oklch(0.78_0.18_195)] uppercase tracking-widest mb-4 block">
                Product Preview
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-6">
                Everything in
                <br />
                <span className="text-gradient-cyan">One Place</span>
              </h2>
              <div className="space-y-6">
                {[
                  {
                    number: "01",
                    title: "Organize your entire prompt library",
                    body: "Create folders, apply tags, and search across all your prompts and workflows in milliseconds.",
                  },
                  {
                    number: "02",
                    title: "Version and collaborate with your team",
                    body: "Every change is tracked on-chain. Review history, compare versions, and merge the best ideas.",
                  },
                  {
                    number: "03",
                    title: "Monitor performance and compliance",
                    body: "Built-in observability dashboards track usage, performance metrics, and provide audit logs.",
                  },
                ].map((item) => (
                  <div key={item.number} className="flex gap-4">
                    <span className="font-mono text-sm font-bold text-[oklch(0.78_0.18_195_/_0.6)] mt-1 shrink-0 w-7">
                      {item.number}
                    </span>
                    <div>
                      <h4 className="font-display font-semibold text-foreground mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-muted-foreground font-body leading-relaxed">
                        {item.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => openModal()}
                className="btn-glow text-[oklch(0.07_0.02_250)] font-semibold mt-8 px-7 h-11"
              >
                Get Early Access
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>

            {/* Dashboard mockup */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative"
            >
              {/* Glow effect behind */}
              <div className="absolute -inset-4 rounded-3xl bg-[oklch(0.55_0.22_250_/_0.08)] blur-2xl" />

              {/* Browser frame */}
              <div className="relative rounded-2xl border border-[oklch(0.78_0.18_195_/_0.25)] overflow-hidden shadow-[0_0_60px_oklch(0.55_0.22_250_/_0.2),_0_20px_60px_oklch(0.07_0.015_260_/_0.8)]">
                {/* Browser chrome */}
                <div className="bg-[oklch(0.13_0.02_260)] border-b border-[oklch(0.25_0.03_255)] px-4 py-3 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[oklch(0.6_0.22_25)]" />
                    <div className="w-3 h-3 rounded-full bg-[oklch(0.72_0.18_80)]" />
                    <div className="w-3 h-3 rounded-full bg-[oklch(0.65_0.18_145)]" />
                  </div>
                  <div className="flex-1 bg-[oklch(0.16_0.02_260)] rounded-md h-6 flex items-center px-3">
                    <span className="text-xs text-muted-foreground font-mono">
                      app.oneprompt.ai
                    </span>
                  </div>
                </div>
                {/* Screenshot */}
                <img
                  src="/assets/uploads/dashboard-preview.dim_1200x750-1.png"
                  alt="OnePrompt.ai dashboard"
                  className="w-full block"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── ICP Trust Section ───────────────────────────── */}
      <section
        id="icp"
        data-ocid="icp.section"
        className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute right-0 top-0 w-[500px] h-[500px] rounded-full bg-[oklch(0.78_0.18_195_/_0.04)] blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            {/* ICP Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl glass-card border border-[oklch(0.78_0.18_195_/_0.2)] mb-8">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[oklch(0.78_0.18_195)] to-[oklch(0.55_0.22_250)] flex items-center justify-center text-xs font-mono font-bold text-[oklch(0.07_0.02_250)]">
                ICP
              </div>
              <span className="font-mono text-sm font-medium text-[oklch(0.78_0.18_195)]">
                Built on Internet Computer Protocol
              </span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Security by Blockchain
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-body">
              ICP is the world's most advanced blockchain, enabling fully
              on-chain web applications with the performance of traditional
              cloud — and none of the vulnerabilities.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {ICP_TRUST_POINTS.map((point, i) => {
              const Icon = point.icon;
              return (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass-card glass-card-hover rounded-2xl p-7 text-center group"
                >
                  <div className="mx-auto mb-5 inline-flex p-3 rounded-2xl bg-[oklch(0.55_0.22_250_/_0.1)] border border-[oklch(0.55_0.22_250_/_0.2)] group-hover:bg-[oklch(0.55_0.22_250_/_0.18)] transition-colors">
                    <Icon className="h-6 w-6 text-[oklch(0.72_0.2_250)]" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-3">
                    {point.title}
                  </h3>
                  <p className="text-muted-foreground text-sm font-body leading-relaxed">
                    {point.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* ICP explanation callout */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 glass-card rounded-2xl p-8 border border-[oklch(0.78_0.18_195_/_0.15)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.78_0.18_195_/_0.5)] to-transparent" />
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-foreground/80 text-base font-body leading-relaxed">
                <span className="text-[oklch(0.85_0.15_195)] font-semibold">
                  Why does ICP matter for your prompts?
                </span>{" "}
                Traditional SaaS stores your proprietary AI prompts on servers
                they control. A breach, acquisition, or shutdown could expose or
                lose years of IP. With OnePrompt.ai on ICP, your data is
                governed by cryptographic contracts — not corporate policies.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Final CTA Section ───────────────────────────── */}
      <section
        data-ocid="cta.section"
        className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      >
        {/* Background radial gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, oklch(0.55 0.22 250 / 0.1) 0%, transparent 70%)",
          }}
        />
        <div className="absolute inset-0 bg-grid opacity-20" />

        <div className="max-w-2xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Dramatic spot counter — display-size number */}
            <div className="mb-6">
              <div
                className="font-display font-extrabold text-gradient-cyan leading-none mb-1"
                style={{ fontSize: "clamp(4rem, 12vw, 7rem)" }}
              >
                <CountUp end={spotsRemaining} />
              </div>
              <p className="font-mono text-sm uppercase tracking-[0.2em] text-muted-foreground">
                Early Access Spots Remaining
              </p>
            </div>

            {/* Progress bar — full width, prominent */}
            <div className="mb-10 mx-auto max-w-sm">
              <div className="h-2 w-full bg-[oklch(0.18_0.025_255)] rounded-full overflow-hidden">
                <div
                  className="capacity-bar-fill h-full"
                  style={{
                    width: `${Math.min(100, ((count > 0 ? count : 247) / MAX_SPOTS) * 100)}%`,
                  }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs font-mono text-muted-foreground">
                <span className="text-[oklch(0.88_0.16_190)]">
                  <CountUp end={count > 0 ? count : 247} /> claimed
                </span>
                <span>{MAX_SPOTS} total</span>
              </div>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground mb-3 leading-tight">
              Don't Miss Your Spot.
            </h2>
            <p
              className="font-body text-base mb-8"
              style={{ color: "oklch(0.62 0.04 240)" }}
            >
              Early members get lifetime pricing, direct roadmap influence, and
              priority onboarding when we launch.
            </p>

            {/* CTA form card — opens modal with email pre-filled */}
            <div className="glass-card rounded-2xl p-6 border border-[oklch(0.35_0.05_240_/_0.35)] shadow-[0_0_60px_oklch(0.55_0.22_250_/_0.08)]">
              <form
                onSubmit={handleCtaSubmit}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Input
                  data-ocid="cta.input"
                  type="email"
                  placeholder="your@company.com"
                  value={ctaEmail}
                  onChange={(e) => setCtaEmail(e.target.value)}
                  required
                  className="flex-1 bg-[oklch(0.1_0.015_260_/_0.9)] border-[oklch(0.28_0.04_255)] focus:border-[oklch(0.78_0.18_195)] h-12 font-body text-sm placeholder:text-muted-foreground"
                  autoComplete="email"
                />
                <button
                  type="submit"
                  data-ocid="cta.submit_button"
                  className="btn-glow-hero"
                >
                  Secure My Spot
                </button>
              </form>
              <p
                className="text-xs font-body mt-3 text-center"
                style={{ color: "oklch(0.48 0.04 240)" }}
              >
                No credit card · No spam · Cancel anytime
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer
        data-ocid="footer.section"
        className="border-t border-[oklch(0.2_0.03_255)] bg-[oklch(0.08_0.015_260)] py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img
                src="/assets/uploads/Oneprompt.ai-LogoSite-1-1.png"
                alt="OnePrompt.ai"
                className="h-8 w-auto object-contain"
              />
            </div>

            {/* ICP badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card border border-[oklch(0.3_0.04_255)]">
              <div className="h-5 w-5 rounded-full bg-gradient-to-br from-[oklch(0.78_0.18_195)] to-[oklch(0.55_0.22_250)] flex items-center justify-center text-[8px] font-mono font-bold text-[oklch(0.07_0.02_250)]">
                ICP
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                Powered by Internet Computer Protocol
              </span>
            </div>

            {/* Links */}
            <nav className="flex items-center gap-6 text-sm text-muted-foreground font-body">
              <a
                href="#features"
                data-ocid="nav.link"
                className="hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                data-ocid="nav.link"
                className="hover:text-foreground transition-colors"
              >
                How It Works
              </a>
              <a
                href="#icp"
                data-ocid="nav.link"
                className="hover:text-foreground transition-colors"
              >
                About ICP
              </a>
            </nav>
          </div>

          <div className="mt-8 pt-8 border-t border-[oklch(0.18_0.025_255)] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground font-body">
              © {new Date().getFullYear()} OnePrompt.ai. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground font-body">
              Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[oklch(0.78_0.18_195)] hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
