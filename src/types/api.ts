export interface PossibleCondition {
  name: string;
  probability: string;
  description: string;
}

export interface SymptomAnalysisResponse {
  status: string;
  possibleConditions: PossibleCondition[];
  recommendations: string[];
  condition: number;
  age: number;
  timestamp: string;
}

export interface SymptomAnalysisRequest {
  symptomps: string;
  sympList: string[];
  age: string;
}

export interface User {
  id: number;
  email: string;
  name?: string;
  age?: number;
  birthday?: string;
  weight?: number;
  height?: number;
  bmi?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
  age?: number;
  birthday?: string;
  weight?: number;
  height?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data: {
    user: User;
    token: string;
  };
} 