/**
 * Membership registration portal.
 *
 * The cooperative registers members in time-boxed intakes, not continuously.
 * These types mirror the server's `/v1/registration` contract — see
 * domicoop-server/src/services/registrationWindow.ts.
 */

/** Why the portal is shut, when it is. Each maps to different copy on the closed screen. */
export type RegistrationClosedReason =
  | "no_window"
  | "not_yet_open"
  | "period_ended"
  | "at_capacity"
  | "closed_by_admin";

/**
 * The applicant-facing view of an intake. Deliberately narrower than the admin
 * row — no capacity, no ids. All amounts are whole Naira.
 */
export interface RegistrationWindow {
  name: string;
  opens_at: string;
  closes_at: string;
  registration_fee: number;
  social_fee: number;
  /** registration_fee + social_fee — what the applicant actually pays. */
  total_due: number;
  min_monthly_subscription: number;
  max_monthly_subscription: number;
  /** null when the intake has no cap. */
  slots_remaining: number | null;
}

export interface RegistrationWindowResponse {
  is_open: boolean;
  reason: RegistrationClosedReason | null;
  window: RegistrationWindow | null;
  /** The previous intake, shown for context when nothing is scheduled. */
  last_window: { name: string; opens_at: string; closes_at: string } | null;
}

/**
 * A completed MEM form plus proof of payment.
 *
 * Field names match the paper "MEMBERSHIP REGISTRATION FORM" one-for-one, so
 * the two can be diffed by eye when the form changes.
 */
export interface MembershipApplicationRequest {
  email: string;
  password: string;
  full_name: string;
  sex?: string;
  /** YYYY-MM-DD. */
  date_of_birth?: string;
  phone: string;
  whatsapp_number?: string;
  marital_status?: string;
  address: string;
  id_card_number?: string;
  next_of_kin?: string;
  place_of_work?: string;
  type_of_business?: string;
  bank_name: string;
  bank_account: string;
  bank_code: string;
  referred_by?: string;
  monthly_subscription?: number;
  avatar_url?: string;
  /** Base64 PNG from the signature pad. */
  signature?: string;
  payment_reference: string;
}

export interface MembershipApplicationResponse {
  message: string;
  user_id: string;
  email: string;
  member_status: "pending";
}
