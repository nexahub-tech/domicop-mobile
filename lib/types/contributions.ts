export type ContributionStatus = "pending" | "verified" | "rejected";
export type PaymentStatus = "success" | "pending" | "failed";

export interface Contribution {
  id: string;
  amount: number;
  month: string;
  status: ContributionStatus;
  proof_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiContribution {
  id: string;
  amount: number;
  year: number;
  month: string;
  transaction_ref: string;
  member_no: string;
  member_email: string;
  payment_method: string;
  payment_status: PaymentStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  transactions: any[];
}

export interface ApiContributionsResponse {
  contributions: ApiContribution[];
  total_balance: number;
  year_balance: number;
  monthly_breakdown: Record<string, number>;
}

export interface CreateContributionInput {
  amount: number;
  month: string;
  proof_url?: string;
  notes?: string;
}

export interface GetContributionsParams {
  year?: number;
  month?: string;
  page?: number;
  limit?: number;
}

export interface ContributionListResponse {
  data: Contribution[];
  total: number;
  page: number;
  limit: number;
}

export interface StoreVerifiedContributionInput {
  amount: number;
  month: string;
  year: number;
  transaction_ref: string;
  member_no?: string;
  member_email?: string;
  payment_method?: string;
  payment_status?: "pending" | "verified" | "rejected";
  notes?: string;
}

export function mapPaymentStatusToContributionStatus(
  paymentStatus: PaymentStatus | string,
): ContributionStatus {
  switch (paymentStatus) {
    case "success":
      return "verified";
    case "pending":
      return "pending";
    case "failed":
      return "rejected";
    default:
      return "pending";
  }
}

export function transformContribution(apiContribution: ApiContribution): Contribution {
  const contributionId = apiContribution.id || apiContribution.transaction_ref;
  const createdAt = apiContribution.created_at || `${apiContribution.month}-01T00:00:00.000Z`;
  const updatedAt = apiContribution.updated_at || createdAt;

  return {
    id: contributionId,
    amount: Math.round(apiContribution.amount / 100),
    month: apiContribution.month,
    status: mapPaymentStatusToContributionStatus(apiContribution.payment_status),
    created_at: createdAt,
    updated_at: updatedAt,
  };
}

export function transformContributionsResponse(
  apiResponse: ApiContributionsResponse,
): ContributionListResponse {
  const contributions = (apiResponse.contributions || []).map(transformContribution);

  return {
    data: contributions,
    total: apiResponse.contributions?.length || 0,
    page: 0,
    limit: 0,
  };
}
