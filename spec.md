# OnePrompt.ai

## Current State

Landing page with waitlist conversion funnel. Backend stores name, company (optional), and email for each waitlist entry. Admin panel accessible via Internet Identity shows all entries and allows CSV export. The WaitlistModal has a success state that simply says "You're in!" with no further action.

## Requested Changes (Diff)

### Add
- **Referral codes**: Each waitlist entry gets a unique referral code stored on-chain. When a new entry is submitted with a valid referral code, both the referrer and referee are linked.
- **Referral link generation**: After joining the waitlist, the success state shows the user's unique referral link (e.g. `https://app.com/?ref=ABC123`).
- **Share UI**: Success state includes copy-to-clipboard button and optional share via Twitter/X with pre-filled text.
- **Referral count display**: After joining, show how many people have used the user's link (so they have a reason to return and share).
- **URL param handling**: App reads `?ref=CODE` from the URL on load and pre-fills it in the modal submission, so referred visitors automatically get attributed.
- **Admin panel**: Add a "Referrals" column to the waitlist table showing the referral code and how many referrals each person generated.

### Modify
- `WaitlistModal` success state: replace simple "Done" with referral link display + copy + share buttons.
- `WaitlistModal` form: accept and pass referral code from URL param when submitting.
- Backend `addEntry`: accept an optional `referralCode` parameter. Return the new entry's referral code.
- `AdminPanel`: add referral code and referral count columns to the table.

### Remove
- Nothing removed.

## Implementation Plan

1. Update backend (`addEntry`) to accept optional `referralCode` (the code of the referrer), generate a unique code for the new entry, store referral relationships, and return the new entry's code.
2. Add backend query `getReferralCount(code: string): Promise<number>` to get how many referrals a code has generated.
3. Add backend query `getEntryByCode(code: string): Promise<WaitlistEntry | null>` for admin use.
4. Update `backend.d.ts` with new method signatures.
5. Update `WaitlistModal`:
   - On mount, read `?ref=` URL param and store it.
   - Pass referral code to `addEntry` mutation.
   - On success, display the generated referral link, copy button, and Twitter share button.
6. Update `AdminPanel` table to show referral code and referral count per entry.
7. Add `useReferralCount` query hook.
