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
