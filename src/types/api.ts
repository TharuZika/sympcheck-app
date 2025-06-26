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