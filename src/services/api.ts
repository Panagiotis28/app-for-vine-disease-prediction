
import { PredictionResponse, ErrorResponse, PredictionHistory } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const uploadImage = async (file: File): Promise<PredictionResponse> => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${API_URL}/predict`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json() as ErrorResponse;
      throw new Error(errorData.message || "Failed to process image");
    }

    return await response.json() as PredictionResponse;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const getPredictionHistory = async (): Promise<PredictionHistory[]> => {
  try {
    const response = await fetch(`${API_URL}/history`);
    
    if (!response.ok) {
      const errorData = await response.json() as ErrorResponse;
      throw new Error(errorData.message || "Failed to fetch prediction history");
    }

    // For each history item that has an imageUrl without a full path, prepend the API URL
    const history = await response.json() as PredictionHistory[];
    
    return history.map(item => {
      if (item.imageUrl && !item.imageUrl.startsWith('http')) {
        return {
          ...item,
          imageUrl: `${API_URL.replace('/api', '')}/${item.imageUrl}`
        };
      }
      return item;
    });
  } catch (error) {
    console.error("Error fetching prediction history:", error);
    throw error;
  }
};
