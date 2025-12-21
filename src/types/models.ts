// Centralized type definitions for all data models

export interface User {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
  };
}

export interface Session {
  access_token: string;
  user: User;
}

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  phone: string | null;
  location: string;
  language: string;
  profileImage?: string | null;
  createdAt?: string;
}

export interface Crop {
  id: string;
  name: string;
  name_hi: string | null;
  image_url: string | null;
  stages: string[] | null;
}

export interface UserCrop {
  id: string;
  crop_id: string;
  stage: string;
  is_active: boolean;
  crop?: Crop;
}

export interface Pest {
  id: string;
  crop_id: string;
  name: string;
  name_hi: string | null;
  scientific_name: string | null;
  image_url: string | null;
  symptoms: string[] | null;
  symptoms_hi: string[] | null;
}

export interface Advisory {
  id: string;
  pest_id: string;
  cultural_methods: string[] | null;
  cultural_methods_hi: string[] | null;
  biological_methods: string[] | null;
  biological_methods_hi: string[] | null;
  chemical_methods: string[] | null;
  chemical_methods_hi: string[] | null;
}

export interface Alert {
  id: string;
  title: string;
  title_hi: string | null;
  description: string | null;
  description_hi: string | null;
  risk_level: 'low' | 'medium' | 'high' | 'critical' | null;
  crop_id: string | null;
  location: string | null;
  valid_until: string | null;
  created_at: string;
}

export interface SprayLog {
  id: string;
  user_id: string;
  crop_id: string;
  pest_id: string | null;
  product_name: string;
  application_date: string;
  dosage: string | null;
  area_treated: string | null;
  weather_conditions: string | null;
  notes: string | null;
  created_at: string;
}

export interface CommunityPost {
  id: string;
  user_id: string | { id: string; name: string; profileImage?: string };
  title: string;
  content: string;
  crop_id: string | null;
  image_url: string | null;
  likes_count: number;
  replies_count: number;
  created_at: string;
  updated_at: string;
}

export interface CommunityReply {
  id: string;
  post_id: string;
  user_id: string | { id: string; name: string; profileImage?: string };
  content: string;
  created_at: string;
  updated_at: string;
}

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIPrediction {
  pest_name: string;
  scientific_name?: string;
  confidence: number;
  symptoms: string[];
  treatment: string[];
}

export interface AIIdentificationResult {
  predictions: AIPrediction[];
  general_advice: string;
}

export interface AISymptomCheckResult {
  likely_pests: AIPrediction[];
  recommendations: string[];
}
