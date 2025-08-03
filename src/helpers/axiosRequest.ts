import axios, { Method } from "axios";

// Get the correct base URL depending on environment
const getBaseUrl = () => {
  if (typeof window === 'undefined') {
    // Server-side: use absolute URL
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
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
  
  const response = await axios({
    url: url, // Use full URL instead of relative
    method: method,
    data: data,
    headers: headers,
  });
  return response.data;
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
  return apiRequest({ endpoint, data, method: "get", headers: apiHeaders });
};

export const apiFormData = async <T = unknown>(endpoint: string, formDataObj: FormData): Promise<T> => {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  
  const response = await axios.post(url, formDataObj, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};