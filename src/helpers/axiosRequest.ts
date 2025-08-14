import axios, { Method } from "axios";

// Get the correct base URL depending on environment
const getBaseUrl = () => {
  if (typeof window === 'undefined') {
    // Server-side: use relative URL for internal API calls
    return '';
  }
  // Client-side: use relative URL
  return '';
};

interface ApiRequestParams<TRequest = unknown, TResponse = unknown> {
  endpoint: string;
  data?: TRequest;
  method: Method;
  headers?: Record<string, string>;
}

export const apiRequest = async <TRequest = unknown, TResponse = unknown>({
  endpoint,
  data,
  method,
  headers,
}: ApiRequestParams<TRequest, TResponse>): Promise<TResponse> => {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  
  console.log('Making request to:', url); // Debug log
  
  try {
    const response = await axios({
      url: url,
      method: method,
      data: data,
      headers: headers,
      timeout: 10000, // 10 second timeout
    });
    return response.data;
  } catch (error) {
    console.error(`API request failed for ${url}:`, error);
    // Return a default response structure for static generation
    if (typeof window === 'undefined') {
      return {
        success: false,
        data: null,
        message: 'API request failed during static generation'
      } as TResponse;
    }
    throw error;
  }
};

export const apiPost = <TResponse = unknown, TRequest = unknown>(
  endpoint: string, 
  data: TRequest
): Promise<TResponse> => {
  const apiHeaders = {
    "Content-Type": "application/json",
  };

  return apiRequest<TRequest, TResponse>({ endpoint, data, method: "post", headers: apiHeaders });
};

export const apiGet = <T = unknown>(endpoint: string, data: T | null = null): Promise<T | null> => {
  const apiHeaders = {
    "Content-Type": "application/json",
  };
  
  try {
    return apiRequest({ endpoint, data, method: "get", headers: apiHeaders });
  } catch (error) {
    console.error(`GET request failed for ${endpoint}:`, error);
    // Return null for failed requests during static generation
    if (typeof window === 'undefined') {
      return Promise.resolve(null);
    }
    throw error;
  }
};

// Safe version of apiGet that returns fallback data for static generation
export const safeApiGet = <T = unknown>(endpoint: string, fallbackData: T): Promise<T> => {
  const apiHeaders = {
    "Content-Type": "application/json",
  };
  
  try {
    const result = apiRequest({ endpoint, data: null, method: "get", headers: apiHeaders });
    return result as Promise<T>;
  } catch (error) {
    console.warn(`Safe GET request failed for ${endpoint}, using fallback data:`, error);
    return Promise.resolve(fallbackData);
  }
};

export const apiFormData = async <T = unknown>(endpoint: string, formDataObj: FormData): Promise<T> => {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  
  try {
    const response = await axios.post(url, formDataObj, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 10000, // 10 second timeout
    });
    return response.data;
  } catch (error) {
    console.error(`FormData request failed for ${url}:`, error);
    // Return a default response structure for static generation
    if (typeof window === 'undefined') {
      return {
        success: false,
        data: null,
        message: 'FormData request failed during static generation'
      } as T;
    }
    throw error;
  }
};