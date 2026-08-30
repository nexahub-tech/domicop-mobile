export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Transaction {
  id: string;
  type: 'contribution' | 'payment' | 'loan';
  amount: number;
  date: Date;
}

export interface Loan {
  id: string;
  amount: number;
  purpose: string;
  term: number;
  interestRate: number;
}

// ============================================
// SIGN UP / REGISTRATION TYPES
// ============================================

/**
 * The membership registration form, field-for-field with the cooperative's
 * paper MEM form. Everything is held as a string while editing — numbers are
 * parsed once, at submit, so a half-typed amount never becomes NaN in state.
 */
export interface SignUpData {
  email: string;
  password: string;
  full_name: string;
  sex: string;
  /** YYYY-MM-DD. */
  date_of_birth: string;
  phone: string;
  whatsapp_number: string;
  marital_status: string;
  address: string;
  id_card_number: string;
  next_of_kin: string;
  place_of_work: string;
  type_of_business: string;
  bank_name: string;
  bank_account: string;
  bank_code: string;
  referred_by: string;
  /** Whole Naira, as typed. Validated against the window's min/max at step 4. */
  monthly_subscription: string;
  avatar_url?: string;
  /** Base64 PNG data URL from the signature pad. */
  signature?: string;
}

export interface SignUpResponse {
  message: string;
  user_id: string;
  email: string;
}

export type SignUpErrors = Partial<Record<keyof SignUpData, string>> & {
  /** Cross-field problems: a rejected payment, a closed window, a missing consent. */
  terms?: string;
  general?: string;
};

/**
 * 1 account · 2 personal · 3 work · 4 bank & subscription ·
 * 5 photo & signature · 6 review & pay
 */
export type SignUpStep = 1 | 2 | 3 | 4 | 5 | 6;

export interface BankOption {
  code: string;
  name: string;
}

// ============================================
// PAYSTACK VERIFICATION TYPES
// ============================================

export interface PaystackCustomField {
  display_name: string;
  variable_name: string;
  value: string;
}

export interface PaystackAuthorization {
  authorization_code: string;
  bin: string;
  last4: string;
  exp_month: string;
  exp_year: string;
  channel: string;
  card_type: string;
  bank: string;
  country_code: string;
  brand: string;
  reusable: boolean;
  signature: string;
  account_name: string | null;
  receiver_bank_account_number: string | null;
  receiver_bank: string | null;
}

export interface PaystackCustomer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  customer_code: string;
  phone: string;
  metadata: null;
  risk_action: string;
  international_format_phone: string | null;
}

export interface PaystackLogHistory {
  type: string;
  message: string;
  time: number;
}

export interface PaystackLog {
  start_time: number;
  time_spent: number;
  attempts: number;
  errors: number;
  success: boolean;
  mobile: boolean;
  input: unknown[];
  history: PaystackLogHistory[];
}

export interface PaystackMetadata {
  custom_fields: PaystackCustomField[];
  member_id?: string;
  member_name?: string;
  contribution_id?: string;
  loan_id?: string;
  referrer?: string;
}

export interface PaystackTransactionData {
  id: number;
  domain: string;
  status: string;
  reference: string;
  receipt_number: string | null;
  amount: number;
  message: string | null;
  gateway_response: string;
  paid_at: string;
  created_at: string;
  channel: string;
  currency: string;
  ip_address: string;
  metadata: PaystackMetadata;
  log: PaystackLog;
  fees: number;
  fees_split: string | null;
  authorization: PaystackAuthorization;
  customer: PaystackCustomer;
  plan: string | null;
  split: Record<string, unknown>;
  order_id: string | null;
  paidAt: string;
  createdAt: string;
  requested_amount: number;
  pos_transaction_data: string | null;
  source: string | null;
  fees_breakdown: string | null;
  connect: string | null;
  transaction_date: string;
  plan_object: Record<string, unknown>;
  subaccount: Record<string, unknown>;
}

export interface PaystackVerificationResponse {
  status: boolean;
  message: string;
  data: PaystackTransactionData;
}
