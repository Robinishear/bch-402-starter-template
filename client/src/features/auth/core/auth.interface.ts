export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  accessToken?: string;
  refreshToken?: string;
  token?: string; 
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}