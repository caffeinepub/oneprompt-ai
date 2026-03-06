import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAddEntry } from "@/hooks/useQueries";
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  Clipboard,
  Loader2,
  Lock,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/* ── Referral helpers ──────────────────────────────────────────── */

const LS_REF_CODE_KEY = "oneprompt_ref_code";
const LS_REF_EMAIL_KEY = "oneprompt_ref_email";

function generateRefCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no O/0, I/1 ambiguity
  let code = "";
  const arr = new Uint8Array(6);
  crypto.getRandomValues(arr);
  for (const byte of arr) {
    code += chars[byte % chars.length];
  }
  return code;
}

function getOrCreateRefCode(email: string): string {
  const stored = localStorage.getItem(LS_REF_CODE_KEY);
  if (stored) return stored;
  const code = generateRefCode();
  localStorage.setItem(LS_REF_CODE_KEY, code);
  localStorage.setItem(LS_REF_EMAIL_KEY, email);
  return code;
}

function getExistingRefCode(): string | null {
  return localStorage.getItem(LS_REF_CODE_KEY);
}

function getRefParamFromURL(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get("ref");
}

/* ── Component ──────────────────────────────────────────────────── */

interface WaitlistModalProps {
  open: boolean;
  onClose: () => void;
  spotsRemaining: number;
  totalSpots?: number;
  initialEmail?: string;
}

const DEFAULT_TOTAL = 500;

export function WaitlistModal({
  open,
  onClose,
  spotsRemaining,
  totalSpots = DEFAULT_TOTAL,
  initialEmail = "",
}: WaitlistModalProps) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [submitted, setSubmitted] = useState(false);
  const [refCode, setRefCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const addEntry = useAddEntry();

  // URL ref param — read once on mount
  const urlRefParam = useRef<string | null>(null);
  useEffect(() => {
    urlRefParam.current = getRefParamFromURL();
  }, []);

  // sync initialEmail whenever modal opens
  useEffect(() => {
    if (open) {
      setEmail(initialEmail);
      // If user already has a ref code, preload it for the success state
      const existing = getExistingRefCode();
      if (existing) setRefCode(existing);
    }
  }, [open, initialEmail]);

  const claimedCount = totalSpots - spotsRemaining;
  const fillPct = Math.min(100, (claimedCount / totalSpots) * 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    try {
      await addEntry.mutateAsync({
        name: name.trim(),
        company: company.trim() || null,
        email: email.trim().toLowerCase(),
      });
      // Generate / retrieve referral code after successful submission
      const code = getOrCreateRefCode(email.trim().toLowerCase());
      setRefCode(code);
      setSubmitted(true);
    } catch {
      // error handled via addEntry.isError
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setName("");
      setCompany("");
      setEmail("");
      setSubmitted(false);
      setCopied(false);
      addEntry.reset();
      // Don't clear refCode — keep it loaded for next open
    }, 300);
  };

  const referralLink =
    typeof window !== "undefined" && refCode
      ? `${window.location.origin}/?ref=${refCode}`
      : "";

  const tweetText = encodeURIComponent(
    "I just joined the OnePrompt.ai waitlist — a private on-chain AI prompt library. Get early access before it's gone:",
  );
  const tweetUrl = referralLink
    ? encodeURIComponent(referralLink)
    : encodeURIComponent(
        typeof window !== "undefined" ? window.location.origin : "",
      );
  const twitterShareHref = `https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`;

  const handleCopy = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
    });
  };

  const isDuplicate =
    addEntry.isError &&
    addEntry.error instanceof Error &&
    addEntry.error.message.toLowerCase().includes("already");

  // Returning user: has a code but never submitted in this session
  const isReturningUser = !submitted && refCode !== null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        data-ocid="waitlist.dialog"
        className="glass-card max-w-md p-0 overflow-hidden border-0"
        style={{
          borderImage: "none",
          outline: "1px solid oklch(0.38 0.06 220 / 0.35)",
          boxShadow:
            "0 0 0 1px oklch(0.38 0.06 220 / 0.35), 0 0 60px oklch(0.55 0.22 250 / 0.15), 0 32px 80px oklch(0.06 0.015 260 / 0.8)",
        }}
      >
        {/* Top glow line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.78_0.18_195)] to-transparent" />

        <AnimatePresence mode="wait">
          {submitted || isReturningUser ? (
            /* ── Success / Referral state ── */
            <motion.div
              key="success"
              data-ocid="waitlist.success_state"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col p-8"
            >
              {/* Close */}
              <button
                type="button"
                data-ocid="waitlist.close_button"
                onClick={handleClose}
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-white/5"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 rounded-full bg-[oklch(0.78_0.18_195_/_0.25)] blur-xl scale-150" />
                  <CheckCircle2 className="relative h-10 w-10 text-[oklch(0.78_0.18_195)]" />
                </div>
                <div>
                  {isReturningUser && !submitted ? (
                    <>
                      <h3 className="font-display text-xl font-bold text-foreground">
                        Your referral link is ready.
                      </h3>
                      <p
                        className="font-body text-xs mt-0.5"
                        style={{ color: "oklch(0.62 0.04 240)" }}
                      >
                        Share it to move up the waitlist.
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="font-display text-xl font-bold text-foreground">
                        You're in! Now move up the list.
                      </h3>
                      <p
                        className="font-body text-xs mt-0.5"
                        style={{ color: "oklch(0.62 0.04 240)" }}
                      >
                        Spot secured on the ICP blockchain.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Referral intro */}
              <p
                className="font-body text-sm leading-relaxed mb-5"
                style={{ color: "oklch(0.72 0.04 240)" }}
              >
                Every friend you refer moves you up the list. Share your
                personal link:
              </p>

              {/* Referral link box — terminal/code aesthetic */}
              <div
                className="relative mb-4 rounded-xl overflow-hidden"
                style={{
                  background: "oklch(0.08 0.015 260 / 0.9)",
                  border: "1px solid oklch(0.78 0.18 195 / 0.4)",
                  boxShadow:
                    "0 0 0 1px oklch(0.78 0.18 195 / 0.08), 0 0 24px oklch(0.78 0.18 195 / 0.12)",
                }}
              >
                {/* Animated glow top edge */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, oklch(0.78 0.18 195 / 0.8), transparent)",
                  }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{
                    duration: 2.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />

                {/* Terminal label */}
                <div
                  className="flex items-center gap-1.5 px-3 pt-2.5 pb-1"
                  style={{ borderBottom: "1px solid oklch(0.22 0.03 255)" }}
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-[oklch(0.6_0.22_25)]" />
                  <div className="h-1.5 w-1.5 rounded-full bg-[oklch(0.72_0.18_80)]" />
                  <div className="h-1.5 w-1.5 rounded-full bg-[oklch(0.65_0.18_145)]" />
                  <span
                    className="ml-1.5 text-[10px] font-mono uppercase tracking-widest"
                    style={{ color: "oklch(0.48 0.04 240)" }}
                  >
                    your referral link
                  </span>
                </div>

                <div className="flex items-center gap-2 px-3 py-3">
                  <p
                    className="flex-1 font-mono text-xs truncate select-all"
                    style={{ color: "oklch(0.88 0.16 190)" }}
                    title={referralLink}
                  >
                    {referralLink}
                  </p>
                  <button
                    type="button"
                    data-ocid="waitlist.copy.button"
                    onClick={handleCopy}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all duration-200"
                    style={{
                      background: copied
                        ? "oklch(0.65 0.18 145 / 0.15)"
                        : "oklch(0.78 0.18 195 / 0.12)",
                      color: copied
                        ? "oklch(0.75 0.18 145)"
                        : "oklch(0.88 0.16 190)",
                      border: copied
                        ? "1px solid oklch(0.65 0.18 145 / 0.4)"
                        : "1px solid oklch(0.78 0.18 195 / 0.3)",
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {copied ? (
                        <motion.span
                          key="check"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="flex items-center gap-1"
                        >
                          <Check className="h-3 w-3" />
                          Copied!
                        </motion.span>
                      ) : (
                        <motion.span
                          key="copy"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="flex items-center gap-1"
                        >
                          <Clipboard className="h-3 w-3" />
                          Copy
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </div>

              {/* Share on X button */}
              <a
                href={twitterShareHref}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="waitlist.share.button"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-mono text-sm font-semibold transition-all duration-200 mb-4"
                style={{
                  background: "oklch(0.14 0.02 260)",
                  border: "1px solid oklch(0.3 0.04 255)",
                  color: "oklch(0.9 0.02 240)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "oklch(0.18 0.02 260)";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "oklch(0.45 0.04 255)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "oklch(0.14 0.02 260)";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "oklch(0.3 0.04 255)";
                }}
              >
                {/* 𝕏 logo */}
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-4 w-4 fill-current"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Share on X
              </a>

              {/* Referred-by note — shown only if URL had ?ref= */}
              {urlRefParam.current && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2 text-xs font-body mb-4 px-3 py-2 rounded-lg"
                  style={{
                    background: "oklch(0.78 0.18 195 / 0.06)",
                    border: "1px solid oklch(0.78 0.18 195 / 0.2)",
                    color: "oklch(0.78 0.18 195)",
                  }}
                >
                  <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
                  Referred by a friend? You're already ahead.
                </motion.div>
              )}

              {/* Done button */}
              <Button
                data-ocid="waitlist.close_button"
                onClick={handleClose}
                variant="ghost"
                className="w-full mt-1 font-mono text-sm text-muted-foreground hover:text-foreground hover:bg-white/5"
              >
                Done
              </Button>
            </motion.div>
          ) : (
            /* ── Form state ── */
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Header band — emotional hook */}
              <div className="px-7 pt-8 pb-5">
                {/* Close */}
                <button
                  type="button"
                  data-ocid="waitlist.close_button"
                  onClick={handleClose}
                  className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-white/5"
                >
                  <X className="h-4 w-4" />
                </button>

                <DialogHeader>
                  {/* Benefit headline — lead with the promise */}
                  <DialogTitle className="font-display text-2xl font-extrabold text-foreground leading-tight mb-2">
                    Your AI prompts deserve
                    <br />
                    <span className="text-gradient-cyan">
                      better protection.
                    </span>
                  </DialogTitle>
                  <p
                    className="font-body text-sm leading-relaxed"
                    style={{ color: "oklch(0.62 0.04 240)" }}
                  >
                    OnePrompt stores, versions, and secures your team's prompts
                    on the Internet Computer — not a server someone else
                    controls.
                  </p>
                </DialogHeader>
              </div>

              {/* Capacity bar — scarcity signal inside the modal */}
              <div className="px-7 pb-5 border-b border-[oklch(0.22_0.03_255)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[oklch(0.88_0.16_190)]">
                    Spots filling fast
                  </span>
                  <span
                    className="text-xs font-mono"
                    style={{ color: "oklch(0.55 0.04 240)" }}
                  >
                    <span className="text-[oklch(0.88_0.16_190)] font-bold">
                      {claimedCount}
                    </span>
                    {" / "}
                    {totalSpots}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[oklch(0.18_0.025_255)] rounded-full overflow-hidden">
                  <div
                    className="capacity-bar-fill h-full"
                    style={{ width: `${fillPct}%` }}
                  />
                </div>
                <p
                  className="text-xs font-body mt-1.5"
                  style={{ color: "oklch(0.72 0.12 30)" }}
                >
                  <span className="font-semibold">{spotsRemaining}</span> spots
                  remaining
                </p>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="px-7 pt-5 pb-7 space-y-4"
              >
                {/* Name field */}
                <div>
                  <label
                    htmlFor="waitlist-name"
                    className="block text-xs font-mono font-semibold uppercase tracking-wider mb-2"
                    style={{ color: "oklch(0.62 0.04 240)" }}
                  >
                    Your name
                  </label>
                  <Input
                    id="waitlist-name"
                    data-ocid="waitlist.name_input"
                    type="text"
                    placeholder="Jane Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-[oklch(0.1_0.015_260_/_0.8)] border-[oklch(0.28_0.04_255)] focus:border-[oklch(0.78_0.18_195)] h-12 font-body text-sm placeholder:text-muted-foreground"
                    autoComplete="name"
                  />
                </div>

                {/* Company field (optional) */}
                <div>
                  <label
                    htmlFor="waitlist-company"
                    className="block text-xs font-mono font-semibold uppercase tracking-wider mb-2"
                    style={{ color: "oklch(0.62 0.04 240)" }}
                  >
                    Company{" "}
                    <span style={{ color: "oklch(0.45 0.04 240)" }}>
                      (optional)
                    </span>
                  </label>
                  <Input
                    id="waitlist-company"
                    data-ocid="waitlist.company_input"
                    type="text"
                    placeholder="Acme Corp"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="bg-[oklch(0.1_0.015_260_/_0.8)] border-[oklch(0.28_0.04_255)] focus:border-[oklch(0.78_0.18_195)] h-12 font-body text-sm placeholder:text-muted-foreground"
                    autoComplete="organization"
                  />
                </div>

                {/* Email field */}
                <div>
                  <label
                    htmlFor="waitlist-email"
                    className="block text-xs font-mono font-semibold uppercase tracking-wider mb-2"
                    style={{ color: "oklch(0.62 0.04 240)" }}
                  >
                    Work email
                  </label>
                  <Input
                    id="waitlist-email"
                    data-ocid="waitlist.input"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-[oklch(0.1_0.015_260_/_0.8)] border-[oklch(0.28_0.04_255)] focus:border-[oklch(0.78_0.18_195)] h-12 font-body text-sm placeholder:text-muted-foreground"
                    autoComplete="email"
                  />
                </div>

                {/* Error */}
                <AnimatePresence>
                  {addEntry.isError && (
                    <motion.div
                      data-ocid="waitlist.error_state"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-sm bg-[oklch(0.6_0.22_25_/_0.08)] border border-[oklch(0.6_0.22_25_/_0.3)] rounded-xl px-3.5 py-2.5"
                      style={{ color: "oklch(0.72 0.18 25)" }}
                    >
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      {isDuplicate
                        ? "This email is already on the waitlist."
                        : "Something went wrong. Please try again."}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Loading */}
                {addEntry.isPending && (
                  <div
                    data-ocid="waitlist.loading_state"
                    className="flex items-center gap-2 text-xs font-mono"
                    style={{ color: "oklch(0.78 0.18 195)" }}
                  >
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Securing your spot on-chain...
                  </div>
                )}

                {/* Submit — assertive, full-width */}
                <button
                  type="submit"
                  data-ocid="waitlist.submit_button"
                  disabled={addEntry.isPending || !name.trim() || !email.trim()}
                  className="btn-glow-hero w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {addEntry.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Claim My Spot
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                {/* Trust line */}
                <div
                  className="flex items-center justify-center gap-1.5 text-xs font-body"
                  style={{ color: "oklch(0.48 0.04 240)" }}
                >
                  <Lock className="h-3 w-3" />
                  Secured on ICP blockchain · No spam, ever
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
