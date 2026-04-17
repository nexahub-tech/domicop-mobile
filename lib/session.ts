import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_EMAIL_KEY = "user_email";

export const session = {
  setTokens: async (accessToken: string, refreshToken: string): Promise<void> => {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
  },

  setEmail: async (email: string): Promise<void> => {
    await SecureStore.setItemAsync(USER_EMAIL_KEY, email);
  },

  getToken: async (): Promise<string | null> => {
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },

  getRefreshToken: async (): Promise<string | null> => {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },

  getEmail: async (): Promise<string | null> => {
    return await SecureStore.getItemAsync(USER_EMAIL_KEY);
  },

  clearTokens: async (): Promise<void> => {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_EMAIL_KEY);
  },
};
