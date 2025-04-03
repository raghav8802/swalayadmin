import axios, { Method } from "axios";

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
  const response = await axios({
    url: endpoint,
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
  const response = await axios.post(endpoint, formDataObj, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};




