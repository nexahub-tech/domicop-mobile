export interface User {
  id: string;
  email: string;
  role: "admin" | "member";
  email_verified: boolean;
}

export interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  address: string | null;
  bank_name: string | null;
  bank_account: string | null;
  bank_code: string | null;
  next_of_kin: string | null;
  role: "admin" | "member";
  status: "pending" | "active" | "suspended";
  member_no: string | null;
  avatar_url: string | null;
  preferences: UserPreferences;
  created_at: string;
  updated_at: string | null;
}

export interface UserPreferences {
  theme?: "light" | "dark" | "system";
  notifications_enabled?: boolean;
  notification_types?: {
    payments?: boolean;
    loans?: boolean;
    announcements?: boolean;
    messages?: boolean;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: User;
}

export interface RegisterRequest {
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

export interface RegisterResponse {
  message: string;
  user_id: string;
  email: string;
}

export interface RefreshResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface LogoutResponse {
  success: boolean;
}

export interface UpdateProfileRequest {
  full_name?: string;
  phone?: string;
  address?: string;
  bank_name?: string;
  bank_account?: string;
  bank_code?: string;
  next_of_kin?: string;
  avatar_url?: string;
}
