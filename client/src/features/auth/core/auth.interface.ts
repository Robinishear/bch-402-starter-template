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