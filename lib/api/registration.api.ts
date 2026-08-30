import { request } from "../http";
import type {
  RegistrationWindowResponse,
  MembershipApplicationRequest,
  MembershipApplicationResponse,
} from "../types/registration";

/**
 * Registration portal endpoints.
 *
 * Both are unauthenticated by necessity — the caller has no account yet — so
 * they use `request`, not `authedRequest`.
 */
export const registration = {
  /** Whether new members can apply right now, and on what terms. */
  getWindow: async (): Promise<RegistrationWindowResponse> => {
    return await request<RegistrationWindowResponse>("/registration/window");
  },

  /**
   * Check an application before paying for it.
   *
   * `apply` takes payment first, so a rejection there lands after the
   * applicant has been charged. This catches the ordinary reasons — the window
   * closed, the email is already registered, the subscription is out of range
   * — while it is still free to fix them. Passing is not a reservation; apply
   * re-checks everything.
   */
  precheck: async (input: {
    email: string;
    monthly_subscription?: number;
  }): Promise<{ ok: true }> => {
    return await request<{ ok: true }>("/registration/precheck", {
      method: "POST",
      body: input,
    });
  },

  /**
   * Submit a paid application.
   *
   * `payment_reference` must be a Paystack reference for a charge that has
   * already completed — the server re-verifies it before creating anything, so
   * calling this before checkout finishes will fail.
   */
  apply: async (
    data: MembershipApplicationRequest,
  ): Promise<MembershipApplicationResponse> => {
    return await request<MembershipApplicationResponse>("/registration/apply", {
      method: "POST",
      body: data,
    });
  },
};

export default registration;
