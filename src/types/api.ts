// API response type definitions

import type { User, Session, Profile, Crop, UserCrop, Pest, Advisory, Alert, SprayLog, CommunityPost, CommunityReply } from './models';

export interface ApiResponse<T = unknown> {
  data: T | null;
  error: Error | null;
}

export interface AuthResponse {
  user: User;
  session: Session;
}

export interface ApiError {
  error: string;
  details?: string[];
}

// Auth API responses
export type SignUpResponse = ApiResponse<AuthResponse>;
export type SignInResponse = ApiResponse<AuthResponse>;
export type GetUserResponse = ApiResponse<{ user: User }>;

// Crops API responses
export type GetCropsResponse = ApiResponse<Crop[]>;
export type GetCropResponse = ApiResponse<Crop & { pests?: Pest[] }>;

// User crops API responses
export type GetUserCropsResponse = ApiResponse<UserCrop[]>;
export type CreateUserCropResponse = ApiResponse<UserCrop>;

// Pests API responses
export type GetPestsResponse = ApiResponse<Pest[]>;
export type GetPestResponse = ApiResponse<Pest & { advisory?: Advisory }>;

// Alerts API responses
export type GetAlertsResponse = ApiResponse<Alert[]>;

// Spray logs API responses
export type GetSprayLogsResponse = ApiResponse<SprayLog[]>;
export type CreateSprayLogResponse = ApiResponse<SprayLog>;

// Community API responses
export type GetPostsResponse = ApiResponse<CommunityPost[]>;
export type CreatePostResponse = ApiResponse<CommunityPost>;
export type GetRepliesResponse = ApiResponse<CommunityReply[]>;
export type CreateReplyResponse = ApiResponse<CommunityReply>;

// Profile API responses
export type GetProfileResponse = ApiResponse<Profile>;
export type UpdateProfileResponse = ApiResponse<Profile>;
