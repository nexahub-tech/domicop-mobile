export const PAYSTACK_SECRET_KEY = process.env.EXPO_PUBLIC_PAYSTACK_SECRET_KEY || "";

export const PAYSTACK_BASE_URL = "https://api.paystack.co";

if (!PAYSTACK_SECRET_KEY) {
  console.error(
    "ERROR: EXPO_PUBLIC_PAYSTACK_SECRET_KEY is not defined. Please set it in your .env file",
  );
}
