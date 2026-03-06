import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useAllEntries, useIsCallerAdmin } from "@/hooks/useQueries";
import {
  AlertCircle,
  Download,
  Loader2,
  LogOut,
  Shield,
  ShieldOff,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { WaitlistEntry } from "../backend.d";

interface AdminPanelProps {
  open: boolean;
  onClose: () => void;
}

function formatJoinedAt(bigintNs: bigint): string {
  // ICP Time is nanoseconds since epoch
  const ms = Number(bigintNs / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function exportCsv(entries: WaitlistEntry[]) {
  const header = ["Name", "Company", "Email", "Date Joined"];
  const rows = entries.map((e) => [
    `"${e.name.replace(/"/g, '""')}"`,
    `"${(e.company ?? "").replace(/"/g, '""')}"`,
    `"${e.email.replace(/"/g, '""')}"`,
    `"${formatJoinedAt(e.joinedAt)}"`,
  ]);
  const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `oneprompt-waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function AdminPanel({ open, onClose }: AdminPanelProps) {
  const { identity, login, clear, isLoggingIn, isInitializing } =
    useInternetIdentity();

  const isLoggedIn = !!identity;

  const {
    data: isAdmin,
    isLoading: isCheckingAdmin,
    isError: isAdminCheckError,
  } = useIsCallerAdmin();

  const {
    data: entries,
    isLoading: isLoadingEntries,
    isError: isEntriesError,
  } = useAllEntries(isLoggedIn && isAdmin === true);

  const handleLogout = () => {
    clear();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="admin-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-[oklch(0.04_0.01_260_/_0.85)] backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel — slides in from right */}
          <motion.aside
            key="admin-panel"
            data-ocid="admin.panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-2xl flex flex-col"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.11 0.018 260) 0%, oklch(0.09 0.015 260) 100%)",
              borderLeft: "1px solid oklch(0.35 0.05 240 / 0.4)",
              boxShadow:
                "-8px 0 48px oklch(0.55 0.22 250 / 0.12), -2px 0 12px oklch(0.04 0.01 260 / 0.6)",
            }}
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.78_0.18_195_/_0.7)] to-transparent" />

            {/* ── Not Logged In ── */}
            {!isLoggedIn && (
              <div className="flex-1 flex items-center justify-center p-8">
                {/* Close */}
                <button
                  type="button"
                  data-ocid="admin.close_button"
                  onClick={onClose}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-white/5"
                >
                  <X className="h-5 w-5" />
                </button>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="glass-card rounded-2xl p-10 max-w-sm w-full text-center border border-[oklch(0.35_0.05_240_/_0.3)]"
                >
                  {/* Shield icon */}
                  <div className="mx-auto mb-6 relative inline-flex">
                    <div className="absolute inset-0 rounded-full bg-[oklch(0.78_0.18_195_/_0.15)] blur-2xl scale-150" />
                    <div className="relative w-16 h-16 rounded-2xl bg-[oklch(0.78_0.18_195_/_0.1)] border border-[oklch(0.78_0.18_195_/_0.25)] flex items-center justify-center">
                      <Shield className="h-8 w-8 text-[oklch(0.78_0.18_195)]" />
                    </div>
                  </div>

                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                    Admin Access
                  </h2>
                  <p
                    className="font-body text-sm leading-relaxed mb-8"
                    style={{ color: "oklch(0.58 0.04 240)" }}
                  >
                    Sign in with Internet Identity to access the admin panel and
                    manage your waitlist entries.
                  </p>

                  {isLoggingIn || isInitializing ? (
                    <div
                      data-ocid="admin.loading_state"
                      className="flex flex-col items-center gap-3"
                    >
                      <Loader2 className="h-6 w-6 animate-spin text-[oklch(0.78_0.18_195)]" />
                      <span
                        className="text-sm font-mono"
                        style={{ color: "oklch(0.65 0.06 230)" }}
                      >
                        {isInitializing ? "Initializing..." : "Signing in..."}
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      data-ocid="admin.login_button"
                      onClick={login}
                      className="btn-glow-hero w-full justify-center"
                    >
                      <Shield className="h-4 w-4" />
                      Sign in with Internet Identity
                    </button>
                  )}

                  <p
                    className="mt-5 text-xs font-mono"
                    style={{ color: "oklch(0.42 0.04 240)" }}
                  >
                    Only the canister owner has access.
                  </p>
                </motion.div>
              </div>
            )}

            {/* ── Logged In: Checking Admin ── */}
            {isLoggedIn && isCheckingAdmin && (
              <div className="flex-1 flex items-center justify-center">
                <button
                  type="button"
                  data-ocid="admin.close_button"
                  onClick={onClose}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-white/5"
                >
                  <X className="h-5 w-5" />
                </button>
                <motion.div
                  data-ocid="admin.loading_state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-4"
                >
                  <Loader2 className="h-8 w-8 animate-spin text-[oklch(0.78_0.18_195)]" />
                  <p
                    className="font-mono text-sm"
                    style={{ color: "oklch(0.65 0.06 230)" }}
                  >
                    Verifying access...
                  </p>
                </motion.div>
              </div>
            )}

            {/* ── Logged In: Not Admin / Error ── */}
            {isLoggedIn &&
              !isCheckingAdmin &&
              (isAdmin === false || isAdminCheckError) && (
                <div className="flex-1 flex items-center justify-center p-8">
                  <button
                    type="button"
                    data-ocid="admin.close_button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-white/5"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <motion.div
                    data-ocid="admin.error_state"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-2xl p-10 max-w-sm w-full text-center border border-[oklch(0.6_0.22_25_/_0.3)]"
                  >
                    <div className="mx-auto mb-6 relative inline-flex">
                      <div className="absolute inset-0 rounded-full bg-[oklch(0.6_0.22_25_/_0.15)] blur-2xl scale-150" />
                      <div className="relative w-16 h-16 rounded-2xl bg-[oklch(0.6_0.22_25_/_0.1)] border border-[oklch(0.6_0.22_25_/_0.3)] flex items-center justify-center">
                        <ShieldOff className="h-8 w-8 text-[oklch(0.72_0.18_25)]" />
                      </div>
                    </div>

                    <h2
                      className="font-display text-xl font-bold mb-2"
                      style={{ color: "oklch(0.82 0.15 25)" }}
                    >
                      Access Denied
                    </h2>
                    <p
                      className="font-body text-sm leading-relaxed mb-8"
                      style={{ color: "oklch(0.58 0.04 240)" }}
                    >
                      Your identity does not have admin privileges for this
                      canister.
                    </p>

                    <button
                      type="button"
                      data-ocid="admin.logout_button"
                      onClick={handleLogout}
                      className="inline-flex items-center justify-center gap-2 px-6 h-10 rounded-xl font-body text-sm font-medium border border-[oklch(0.35_0.05_240_/_0.4)] text-muted-foreground hover:text-foreground hover:border-[oklch(0.5_0.06_240_/_0.5)] transition-all"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </motion.div>
                </div>
              )}

            {/* ── Logged In: Admin Dashboard ── */}
            {isLoggedIn && !isCheckingAdmin && isAdmin === true && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-[oklch(0.25_0.03_255)]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[oklch(0.78_0.18_195_/_0.12)] border border-[oklch(0.78_0.18_195_/_0.25)] flex items-center justify-center">
                      <Shield className="h-4.5 w-4.5 text-[oklch(0.78_0.18_195)]" />
                    </div>
                    <div>
                      <h1 className="font-display text-lg font-bold text-foreground leading-tight">
                        Waitlist Admin
                      </h1>
                      {entries && (
                        <p className="font-mono text-xs text-[oklch(0.78_0.18_195)]">
                          {entries.length} entr
                          {entries.length === 1 ? "y" : "ies"} total
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      data-ocid="admin.logout_button"
                      onClick={handleLogout}
                      className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg font-body text-xs font-medium border border-[oklch(0.3_0.04_255_/_0.5)] text-muted-foreground hover:text-foreground hover:border-[oklch(0.45_0.05_240_/_0.5)] transition-all"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out
                    </button>
                    <button
                      type="button"
                      data-ocid="admin.close_button"
                      onClick={onClose}
                      className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-white/5"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Actions bar */}
                <div className="px-6 py-3 border-b border-[oklch(0.22_0.03_255)] flex items-center justify-between">
                  <p
                    className="font-mono text-xs"
                    style={{ color: "oklch(0.52 0.04 240)" }}
                  >
                    All waitlist sign-ups captured on ICP
                  </p>
                  {entries && entries.length > 0 && (
                    <button
                      type="button"
                      data-ocid="admin.export_button"
                      onClick={() => exportCsv(entries)}
                      className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg font-body text-xs font-medium bg-[oklch(0.78_0.18_195_/_0.1)] border border-[oklch(0.78_0.18_195_/_0.25)] text-[oklch(0.88_0.14_195)] hover:bg-[oklch(0.78_0.18_195_/_0.18)] transition-all"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Export CSV
                    </button>
                  )}
                </div>

                {/* Table content */}
                <div className="flex-1 overflow-hidden">
                  {isLoadingEntries && (
                    <div
                      data-ocid="admin.loading_state"
                      className="h-full flex items-center justify-center gap-3"
                    >
                      <Loader2 className="h-5 w-5 animate-spin text-[oklch(0.78_0.18_195)]" />
                      <span
                        className="font-mono text-sm"
                        style={{ color: "oklch(0.65 0.06 230)" }}
                      >
                        Loading entries...
                      </span>
                    </div>
                  )}

                  {isEntriesError && (
                    <div
                      data-ocid="admin.error_state"
                      className="h-full flex items-center justify-center"
                    >
                      <div className="flex flex-col items-center gap-3 text-center p-8">
                        <AlertCircle className="h-10 w-10 text-[oklch(0.72_0.18_25)]" />
                        <p
                          className="font-body text-sm"
                          style={{ color: "oklch(0.65 0.04 240)" }}
                        >
                          Failed to load waitlist entries.
                          <br />
                          Please try again.
                        </p>
                      </div>
                    </div>
                  )}

                  {!isLoadingEntries &&
                    !isEntriesError &&
                    entries &&
                    (entries.length === 0 ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3 text-center p-8">
                          <div className="w-14 h-14 rounded-2xl bg-[oklch(0.78_0.18_195_/_0.08)] border border-[oklch(0.78_0.18_195_/_0.15)] flex items-center justify-center mb-1">
                            <Shield className="h-6 w-6 text-[oklch(0.78_0.18_195_/_0.5)]" />
                          </div>
                          <p className="font-display text-lg font-semibold text-foreground">
                            No entries yet
                          </p>
                          <p
                            className="font-body text-sm"
                            style={{ color: "oklch(0.52 0.04 240)" }}
                          >
                            Waitlist sign-ups will appear here.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <ScrollArea className="h-full">
                        <Table data-ocid="admin.table" className="w-full">
                          <TableHeader>
                            <TableRow className="border-[oklch(0.22_0.03_255)] hover:bg-transparent">
                              <TableHead className="font-mono text-xs uppercase tracking-wider text-[oklch(0.55_0.05_240)] px-6 py-3 w-[160px]">
                                Name
                              </TableHead>
                              <TableHead className="font-mono text-xs uppercase tracking-wider text-[oklch(0.55_0.05_240)] px-4 py-3 w-[160px]">
                                Company
                              </TableHead>
                              <TableHead className="font-mono text-xs uppercase tracking-wider text-[oklch(0.55_0.05_240)] px-4 py-3">
                                Email
                              </TableHead>
                              <TableHead className="font-mono text-xs uppercase tracking-wider text-[oklch(0.55_0.05_240)] px-4 py-3 w-[120px] text-right">
                                Joined
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {entries.map((entry, i) => (
                              <TableRow
                                key={`${entry.email}-${i}`}
                                data-ocid={`admin.table.row.${i + 1}`}
                                className="border-[oklch(0.2_0.025_255)] hover:bg-[oklch(0.78_0.18_195_/_0.04)] transition-colors"
                              >
                                <TableCell className="px-6 py-3.5 font-body text-sm text-foreground font-medium">
                                  {entry.name}
                                </TableCell>
                                <TableCell className="px-4 py-3.5 font-body text-sm">
                                  {entry.company ? (
                                    <span
                                      style={{
                                        color: "oklch(0.72 0.04 240)",
                                      }}
                                    >
                                      {entry.company}
                                    </span>
                                  ) : (
                                    <span
                                      style={{
                                        color: "oklch(0.42 0.03 240)",
                                      }}
                                    >
                                      —
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell className="px-4 py-3.5 font-mono text-xs text-[oklch(0.72_0.06_220)]">
                                  {entry.email}
                                </TableCell>
                                <TableCell className="px-4 py-3.5 font-mono text-xs text-[oklch(0.52_0.04_240)] text-right">
                                  {formatJoinedAt(entry.joinedAt)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    ))}
                </div>
              </motion.div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
