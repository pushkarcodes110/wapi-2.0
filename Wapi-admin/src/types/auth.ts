export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  permissions?: string[];
  phone?: string;
  country?: string;
  country_code?: string;
  note?: string;
  is_phoneno_hide?: string;
}

export interface Permission {
  name: string;
  slug: string;
  description?: string;
}

export interface PermissionGroup {
  _id: string;
  module: string;
  description?: string;
  submodules: Permission[];
}

export interface LoginRequest {
  identifier: string;
  password: string;
  agenda?: string;
  role?: string;
  role_id?: string;
}

export interface PublicRole {
  _id: string;
  name: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authRedirectField: string;
  permissions: PermissionGroup[];
}

export interface ForgotPasswordRequest {
  mobile?: string;
  email?: string;
}

export interface VerifyOtpRequest {
  mobile?: string;
  email?: string;
  otp: string;
}

export interface ResetPasswordRequest {
  mobile?: string;
  email?: string;
  otp: string;
  password: string;
  password_confirmation: string;
}

export interface GenericResponse {
  message: string;
  status?: boolean;
}

export interface UpdateProfilePayload {
  name: string;
  email: string;
  phone: string;
  country: string;
  country_code: string;
  note?: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}

export interface ProfileResponse {
  success: boolean;
  user: User;
}
