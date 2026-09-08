# LoanLens

A full-stack loan approval prediction analysis module. Enter a requested loan amount, credit score, and monthly income to receive an approval decision with a transparent checkpoint breakdown.

## Run locally

1. Install Node.js 18 or newer.
2. From this folder, run `npm install`.
3. Start both services with `npm run dev`.
4. Open `http://localhost:5173`.

The frontend runs on port 5173 and proxies `/api` requests to the Express backend on port 3001.

## Decision model

The backend approves an application when all three checkpoints pass:

- Credit score is at least 650.
- Monthly income is at least $2,500.
- Requested loan amount is no more than 8 times monthly income.

This is an educational pre-screening model and is not a final lending decision.
