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
  CheckCircle2,
  Loader2,
  Lock,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface WaitlistModalProps {
  open: boolean;
  onClose: () => void;
  spotsRemaining: number;
  totalSpots?: number;
}

const DEFAULT_TOTAL = 500;

export function WaitlistModal({
  open,
  onClose,
  spotsRemaining,
  totalSpots = DEFAULT_TOTAL,
}: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const addEntry = useAddEntry();

  const claimedCount = totalSpots - spotsRemaining;
  const fillPct = Math.min(100, (claimedCount / totalSpots) * 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await addEntry.mutateAsync(email.trim().toLowerCase());
      setSubmitted(true);
    } catch {
      // error handled via addEntry.isError
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setEmail("");
      setSubmitted(false);
      addEntry.reset();
    }, 300);
  };

  const isDuplicate =
    addEntry.isError &&
    addEntry.error instanceof Error &&
    addEntry.error.message.toLowerCase().includes("already");

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
          {submitted ? (
            /* ── Success state ── */
            <motion.div
              key="success"
              data-ocid="waitlist.success_state"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center p-10"
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

              <div className="relative mb-5">
                <div className="absolute inset-0 rounded-full bg-[oklch(0.78_0.18_195_/_0.25)] blur-2xl scale-150" />
                <CheckCircle2 className="relative h-16 w-16 text-[oklch(0.78_0.18_195)]" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                You're in!
              </h3>
              <p
                className="font-body text-sm mb-1"
                style={{ color: "oklch(0.62 0.04 240)" }}
              >
                Spot secured. We'll reach out with early access details.
              </p>
              <p
                className="font-body text-xs mb-8"
                style={{ color: "oklch(0.48 0.04 240)" }}
              >
                Your data is stored on-chain — private by default.
              </p>
              <Button
                onClick={handleClose}
                className="btn-glow text-[oklch(0.07_0.02_250)] font-semibold px-8 h-10"
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
                  disabled={addEntry.isPending || !email.trim()}
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
