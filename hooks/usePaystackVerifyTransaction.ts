import { useState, useCallback } from "react";
import { PAYSTACK_SECRET_KEY, PAYSTACK_BASE_URL } from "@/lib/paystack";
import { PaystackVerificationResponse } from "@/types";

interface UsePaystackVerifyTransactionReturn {
  verifyTransaction: (reference: string) => Promise<PaystackVerificationResponse | null>;
  isVerifying: boolean;
}

export const usePaystackVerifyTransaction =
  (): UsePaystackVerifyTransactionReturn => {
    const [isVerifying, setIsVerifying] = useState(false);

    const verifyTransaction = useCallback(
      async (
        reference: string
      ): Promise<PaystackVerificationResponse | null> => {
        setIsVerifying(true);

        try {
          const response = await fetch(
            `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                "Content-Type": "application/json",
              },
            }
          );

          const data: PaystackVerificationResponse = await response.json();

          if (!response.ok || !data.status) {
            console.error(
              "Transaction verification failed:",
              data.message
            );
            return null;
          }

          return data;
        } catch (err) {
          console.error("Verification error:", err);
          return null;
        } finally {
          setIsVerifying(false);
        }
      },
      []
    );

    return {
      verifyTransaction,
      isVerifying,
    };
  };

export default usePaystackVerifyTransaction;
