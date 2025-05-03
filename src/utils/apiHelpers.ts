
/**
 * Utility functions for API calls with better error handling
 */

/**
 * Fetch wrapper with timeout and error handling
 * @param url - The URL to fetch from
 * @param options - Fetch options
 * @param timeout - Timeout in milliseconds
 */
export const fetchWithTimeout = async (
  url: string, 
  options: RequestInit = {}, 
  timeout = 8000
): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    console.error(`Error fetching from ${url}:`, error);
    throw error;
  }
};

/**
 * Safely parse JSON with error handling
 */
export const safeJsonParse = async (response: Response) => {
  try {
    return await response.json();
  } catch (error) {
    console.error("Error parsing JSON response:", error);
    throw new Error("Invalid JSON response");
  }
};

/**
 * Check if the API is available
 * @param apiUrl - Base API URL to check
 */
export const checkApiAvailability = async (apiUrl: string): Promise<boolean> => {
  try {
    const response = await fetchWithTimeout(`${apiUrl}/health`, {}, 5000);
    return response.ok;
  } catch (error) {
    console.warn("API appears to be offline:", error);
    return false;
  }
};
