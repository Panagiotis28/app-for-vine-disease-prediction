
export interface PredictionResponse {
  prediction: string;
  confidence?: number;
  timestamp?: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
}

export interface PredictionHistory {
  id: number;
  fileName: string;
  prediction: string;
  confidence?: number;
  timestamp: string;
  imageUrl?: string;
}
