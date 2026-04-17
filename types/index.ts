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

export interface SignUpData {
  email: string;
  password: string;
  full_name: string;
  phone: string;
  address: string;
  bank_name: string;
  bank_account: string;
  bank_code: string;
  avatar_url?: string;
  next_of_kin?: string;
}

export interface SignUpResponse {
  message: string;
  user_id: string;
  email: string;
}

export interface SignUpErrors {
  email?: string;
  password?: string;
  full_name?: string;
  phone?: string;
  address?: string;
  bank_name?: string;
  bank_account?: string;
  bank_code?: string;
  avatar_url?: string;
  next_of_kin?: string;
  general?: string;
}

export type SignUpStep = 1 | 2 | 3 | 4;

export interface BankOption {
  code: string;
  name: string;
}

// ============================================
// ONBOARDING TYPES (Legacy - kept for compatibility)
// ============================================

export interface Step3Data {
  avatar_url?: string;
  next_of_kin?: string;
}

export interface OnboardingErrors {
  next_of_kin?: string;
  avatar_url?: string;
  general?: string;
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
