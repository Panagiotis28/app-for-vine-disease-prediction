
import { PredictionResponse, PredictionHistory } from "@/types";

/**
 * Mock prediction history data for when the API is unavailable
 */
export const mockPredictionHistory: PredictionHistory[] = [
  {
    id: 1,
    fileName: "sample-healthy-leaf.jpg",
    imageUrl: "/assets/sample-healthy-leaf.jpg",
    prediction: "Healthy",
    confidence: 0.95,
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() // 1 hour ago
  },
  {
    id: 2,
    fileName: "sample-powdery-mildew.jpg",
    imageUrl: "/assets/sample-powdery-mildew.jpg",
    prediction: "Powdery Mildew",
    confidence: 0.87,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
  },
  {
    id: 3,
    fileName: "sample-black-rot.jpg",
    imageUrl: "/assets/sample-black-rot.jpg",
    prediction: "Black Rot",
    confidence: 0.92,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() // 2 days ago
  }
];

/**
 * Generate a mock prediction response
 */
export const generateMockPrediction = (file: File): Promise<PredictionResponse> => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate random prediction
      const predictions = ["Healthy", "Black Rot", "Powdery Mildew", "Leaf Blight"];
      const randomIndex = Math.floor(Math.random() * predictions.length);
      
      resolve({
        prediction: predictions[randomIndex],
        confidence: 0.7 + Math.random() * 0.25, // Random confidence between 0.7 and 0.95
        timestamp: new Date().toISOString()
      });
    }, 2000);
  });
};
