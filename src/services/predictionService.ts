
import { PredictionResponse, PredictionHistory } from "@/types";
import { fetchWithTimeout, safeJsonParse, checkApiAvailability } from "@/utils/apiHelpers";
import { mockPredictionHistory, generateMockPrediction } from "@/utils/mockData";
import { toast } from "sonner";

// API base URL - this should match your actual API URL
const API_BASE_URL = "/api";

// Flag to track if we're using mock data due to API unavailability
let usingMockData = false;

/**
 * Check API status and notify user if using mock data
 */
export const initializePredictionService = async (): Promise<void> => {
  const isApiAvailable = await checkApiAvailability(API_BASE_URL);
  
  if (!isApiAvailable) {
    usingMockData = true;
    console.warn("Using mock data due to API unavailability");
    toast.error("API Unavailable - Using demo mode with sample data. Some features may be limited.");
  }
};

/**
 * Upload an image and get a prediction
 */
export const uploadAndPredict = async (file: File): Promise<PredictionResponse> => {
  if (usingMockData) {
    return generateMockPrediction(file);
  }
  
  try {
    const formData = new FormData();
    formData.append("image", file);
    
    const response = await fetchWithTimeout(`${API_BASE_URL}/predict`, {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
    
    return await safeJsonParse(response);
  } catch (error) {
    console.error("Error during prediction:", error);
    toast.error("Prediction Error - Using fallback demo mode for this request.");
    
    // Fall back to mock data for this request
    return generateMockPrediction(file);
  }
};

/**
 * Get prediction history
 */
export const getPredictionHistory = async (): Promise<PredictionHistory[]> => {
  if (usingMockData) {
    return mockPredictionHistory;
  }
  
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/history`);
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
    
    return await safeJsonParse(response);
  } catch (error) {
    console.error("Error fetching prediction history:", error);
    
    // Only show toast once when falling back to mock data
    if (!usingMockData) {
      usingMockData = true;
      toast.error("Connection Error - Using demo mode with sample data.");
    }
    
    return mockPredictionHistory;
  }
};
