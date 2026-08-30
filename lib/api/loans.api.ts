import { authedRequest, ApiError } from "@/lib/http";
import type { Loan, LoanType } from "@/lib/types/loans";
import {
  ApiLoan,
  ApiLoansResponse,
  LoanApplicationError,
  LoanApplicationReason,
  transformLoan,
  transformLoansResponse,
} from "@/lib/types/loans";

// Request body for POST /loans/apply (see LOANS_API_CONTRACT.md §3).
// Amount and tenure are naira / months; interest is derived server-side and
// must not be sent. `purpose` is free text (≥ 10 chars); `type` is the loan
// category enum.
export interface LoanGuarantorInput {
  full_name: string;
  bank_name: string;
  bank_account: string;
  phone: string;
  /** Base64 PNG from the signature pad. */
  signature: string;
}

export interface LoanApplicationPayload {
  amount: number;
  purpose: string;
  type: LoanType;
  tenure_months: number;
  // Part A items 2–4 and 7. Prefilled from the profile but sent explicitly:
  // the server stores them as snapshots, because the bond is a legal record of
  // what was signed and must not change when a profile is edited later.
  applicant_address: string;
  applicant_bank_name: string;
  applicant_bank_account: string;
  applicant_phone: string;
  /** Part A item 9. */
  borrower_signature: string;
  /** Part B — exactly three, all required by the paper form. */
  guarantors: LoanGuarantorInput[];
}

/**
 * Thrown when a loan application fails due to an eligibility or conflict
 * reason. Carries the structured server response so the UI can render
 * specific guidance (e.g. progress bar, active-loan message).
 */
export class LoanApplicationRejection extends Error {
  reason: LoanApplicationReason;
  data: LoanApplicationError;

  constructor(reason: LoanApplicationReason, data: LoanApplicationError) {
    super(reason);
    this.name = "LoanApplicationRejection";
    this.reason = reason;
    this.data = data;
  }
}

/**
 * Thrown when POST /loans/:id/repayment returns 404
 * { success: false, reason: "loan_not_found" } — the loan doesn't exist or
 * doesn't belong to the caller. Not transient, so callers should stop
 * retrying instead of treating it like an unsettled charge.
 */
export class RepaymentLoanNotFoundError extends Error {
  constructor() {
    super("loan_not_found");
    this.name = "RepaymentLoanNotFoundError";
  }
}

// Success body of POST /loans/:id/repayment (see LOANS_API_CONTRACT.md §5).
// Failures (non-2xx) surface as ApiError with `{ success: false, reason }` or
// `{ error }` in the body.
interface RepaymentResponse {
  success?: boolean;
  already_processed?: boolean;
  loan_id?: string;
  amount_paid?: number;
  remaining_balance?: number;
  // Loan status after the repayment ("repaying" | "closed").
  status?: string;
}

export const loansApi = {
  getMyLoans: async (): Promise<Loan[]> => {
    const response = await authedRequest<ApiLoansResponse | ApiLoan[]>("/loans/me");
    return transformLoansResponse(response);
  },

  /**
   * Submit a loan application. The server records the request as pending and
   * returns the created loan; the client shows a confirmation and refreshes
   * the loans list. Interest/terms may be re-derived server-side.
   */
  /**
   * The full application, not just the summary in the list.
   *
   * GET /loans/me returns bare loan rows; the guarantors, the signed repayment
   * schedule and the bond only come back from GET /loans/:id. Returned as the
   * raw wire shape because the display transform (`transformLoan`) collapses
   * server statuses into UI buckets and drops the paper-form fields.
   */
  getById: async (id: string): Promise<ApiLoan> => {
    return authedRequest<ApiLoan>(`/loans/${id}`);
  },

  apply: async (payload: LoanApplicationPayload): Promise<Loan | null> => {
    try {
      const response = await authedRequest<{ loan?: ApiLoan } | ApiLoan>(
        "/loans/apply",
        { method: "POST", body: payload },
      );
      const apiLoan =
        response && "loan" in response ? response.loan : (response as ApiLoan);
      return apiLoan && apiLoan.id ? transformLoan(apiLoan) : null;
    } catch (err) {
      if (err instanceof ApiError && (err.status === 403 || err.status === 409)) {
        const body = err.body as LoanApplicationError | undefined;
        if (body?.reason) {
          throw new LoanApplicationRejection(body.reason, body);
        }
      }
      throw err;
    }
  },

  /**
   * Server-side repayment verification: the API confirms the reference with
   * Paystack and applies the repayment to the loan. The client never sends
   * amounts — the server derives them from the verified transaction.
   */
  verifyRepayment: async (
    loanId: string,
    reference: string,
  ): Promise<{ verified: boolean; chargeStatus?: string }> => {
    try {
      const response = await authedRequest<RepaymentResponse>(
        `/loans/${loanId}/repayment`,
        { method: "POST", body: { reference } },
      );
      return {
        verified: response.success === true || !!response.already_processed,
        chargeStatus: response.status,
      };
    } catch (err) {
      if (
        err instanceof ApiError &&
        err.status === 404 &&
        (err.body as { reason?: string } | undefined)?.reason === "loan_not_found"
      ) {
        throw new RepaymentLoanNotFoundError();
      }
      throw err;
    }
  },
};

export default loansApi;
