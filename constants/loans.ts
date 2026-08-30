// Loan product configuration and helpers (extracted from the retired data/mockData.ts).

import type { LoanType, LoanTypeConfig } from "@/lib/types/loans";

// Loan Configuration.
//
// Tenure mirrors the server's single source of truth, domicoop-server
// `src/services/loanTerms.ts` (MIN/MAX_TENURE_MONTHS), and domicoop-admin
// `lib/types/loans.ts` — one month of grace after disbursement, repaid within
// one year. Change all three together.
//
// Amount deliberately does NOT mirror the server: POST /loans/apply accepts
// ≥ ₦1,000 as a floor for any conceivable product, while the cooperative's own
// floor for this one is ₦50,000. The app enforces the tighter figure.
export const loanConfig = {
  minAmount: 50000, // ₦50,000
  maxAmount: 10000000, // ₦10,000,000
  defaultInterestRate: 10, // 10% APR
  minTerm: 1,
  maxTerm: 12,
  // Months after disbursement before the first installment falls due. The bond
  // says the principal is repaid "within ELEVAN Month in equal installments"
  // and Part A has eleven month/amount rows — on a twelve-month term. So a
  // 12-month loan is 1 month of grace plus 11 payments, not 12 payments.
  // Mirrors GRACE_MONTHS in domicoop-server src/services/loanSchedule.ts.
  graceMonths: 1,
};

/** How many payments a term actually produces, after the grace month. */
export const installmentCount = (term: number): number =>
  Math.max(term - loanConfig.graceMonths, 0);

// Loan types with styling — the 5 categories accepted by the API.
export const loanTypes: LoanTypeConfig[] = [
  {
    id: "business",
    label: "Business",
    icon: "storefront",
    color: "#0b50da",
    bgColor: "#eff6ff",
  },
  {
    id: "education",
    label: "Education",
    icon: "school",
    color: "#7c3aed",
    bgColor: "#f3e8ff",
  },
  {
    id: "emergency",
    label: "Emergency",
    icon: "emergency",
    color: "#ea580c",
    bgColor: "#fff7ed",
  },
  {
    id: "housing",
    label: "Housing",
    icon: "home-repair-service",
    color: "#16a34a",
    bgColor: "#f0fdf4",
  },
  {
    id: "personal",
    label: "Personal",
    icon: "account-circle",
    color: "#4f46e5",
    bgColor: "#eef2ff",
  },
];

export const getLoanTypeConfig = (type: LoanType): LoanTypeConfig => {
  return loanTypes.find((t) => t.id === type) || loanTypes[0];
};

// Loan calculation helper — the co-op charges a flat rate on the principal
// (e.g. 10% of ₦500,000 = ₦50,000), so interest is not amortised over the term.
export const calculateLoan = (amount: number, term: number, rate: number) => {
  const totalInterest = (amount * rate) / 100;
  const totalRepayment = amount + totalInterest;

  // Divided by the number of INSTALLMENTS, not the term: the grace month
  // carries no payment. Dividing by the term understated every installment and
  // disagreed with what the server would later schedule.
  const payments = installmentCount(term);
  const monthlyPayment = payments > 0 ? totalRepayment / payments : 0;

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalRepayment: Math.round(totalRepayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    installments: payments,
    graceMonths: loanConfig.graceMonths,
  };
};

/**
 * The dated rows the borrower signs on Part A item 8, previewed before
 * submission. The server rebuilds this authoritatively at approval — this is a
 * preview, so it deliberately mirrors buildSchedule() including the final
 * installment absorbing the rounding remainder.
 */
export const buildSchedulePreview = (
  amount: number,
  term: number,
  rate: number,
  startDate: Date = new Date(),
) => {
  const { totalRepayment, installments } = calculateLoan(amount, term, rate);
  if (installments < 1) return [];

  const even = Math.floor((totalRepayment / installments) * 100) / 100;
  const rows: { installment_no: number; due_on: Date; amount: number }[] = [];
  let allocated = 0;

  for (let i = 1; i <= installments; i++) {
    const isLast = i === installments;
    const value = isLast
      ? Math.round((totalRepayment - allocated) * 100) / 100
      : even;
    allocated = Math.round((allocated + value) * 100) / 100;

    const due = new Date(startDate);
    due.setMonth(due.getMonth() + loanConfig.graceMonths + i - 1);
    rows.push({ installment_no: i, due_on: due, amount: value });
  }
  return rows;
};


export const loanInsights = [
  "Paying just ₦5,000 extra per month on your loans can save you significant interest over time.",
  "Consider consolidating multiple loans to get a lower overall interest rate.",
  "Setting up automatic payments ensures you never miss a due date.",
  "Making bi-weekly payments instead of monthly can help you pay off loans faster.",
  "Review your loan terms regularly - refinancing might save you money.",
];
