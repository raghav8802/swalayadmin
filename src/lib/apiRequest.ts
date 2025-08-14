/**
 * @file A utility for making typed API requests with fetch
 * @module lib/api
 */

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiOptions extends RequestInit {
  method?: HttpMethod;
  headers?: HeadersInit;
  body?: any;
  cache?: RequestCache;
}

/**
 * Makes a typed API request using fetch with standardized error handling
 * @template T - The expected response type
 * @param {string} endpoint - The API endpoint (e.g., '/api/data')
 * @param {ApiOptions} [options={}] - Fetch options
 * @returns {Promise<T>} Resolves with typed response data or rejects with error
 * @throws {Error} When request fails or returns error status
 */
export async function apiFetch<T = any>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  try {
    const config: RequestInit = {
      cache: "no-store",
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    // Stringify body if it's an object and not FormData
    if (
      options.body &&
      typeof options.body === "object" &&
      !(options.body instanceof FormData)
    ) {
      config.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      let errorMessage = "An error occurred";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = response.statusText;
      }
      throw new Error(errorMessage);
    }

    // Handle empty responses (like for 204 No Content)
    if (response.status === 204) {
      return undefined as unknown as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

/**
 * Safe API fetch for static generation - returns fallback data on error
 * @template T - The expected response type
 * @param {string} endpoint - The API endpoint
 * @param {T} fallbackData - Data to return if request fails
 * @param {ApiOptions} [options={}] - Fetch options
 * @returns {Promise<T>} Resolves with response data or fallback data
 */
export async function safeApiFetch<T = any>(
  endpoint: string,
  fallbackData: T,
  options: ApiOptions = {}
): Promise<T> {
  try {
    return await apiFetch<T>(endpoint, options);
  } catch (error) {
    console.warn(`API request failed for ${endpoint}, using fallback data:`, error);
    return fallbackData;
  }
}

/**
 * Convenience methods for common HTTP verbs with TypeScript support
 * @namespace api
 */
export const api = {
  /**
   * Makes a typed GET request
   * @template T - Expected response type
   * @example
   * const users = await api.get<User[]>('/api/users');
   */
  get: <T = any>(endpoint: string, options?: Omit<ApiOptions, "method">) =>
    apiFetch<T>(endpoint, { ...options, method: "GET" }),

  /**
   * Makes a typed POST request
   * @template T - Expected response type
   * @template B - Request body type
   * @example
   * const newUser = await api.post<User, CreateUserDto>('/api/users', userData);
   */
  post: <T = any, B = any>(
    endpoint: string,
    body?: B,
    options?: Omit<ApiOptions, "method" | "body">
  ) => apiFetch<T>(endpoint, { ...options, method: "POST", body }),

  /**
   * Makes a typed PUT request
   * @template T - Expected response type
   * @template B - Request body type
   */
  put: <T = any, B = any>(
    endpoint: string,
    body?: B,
    options?: Omit<ApiOptions, "method" | "body">
  ) => apiFetch<T>(endpoint, { ...options, method: "PUT", body }),

  /**
   * Makes a typed PATCH request
   * @template T - Expected response type
   * @template B - Request body type
   */
  patch: <T = any, B = any>(
    endpoint: string,
    body?: B,
    options?: Omit<ApiOptions, "method" | "body">
  ) => apiFetch<T>(endpoint, { ...options, method: "PATCH", body }),

  /**
   * Makes a typed DELETE request
   * @template T - Expected response type
   */
  delete: <T = any>(endpoint: string, options?: Omit<ApiOptions, "method">) =>
    apiFetch<T>(endpoint, { ...options, method: "DELETE" }),

  /**
   * Safe GET request that returns fallback data on error
   * @template T - Expected response type
   * @param {string} endpoint - The API endpoint
   * @param {T} fallbackData - Data to return if request fails
   * @param {ApiOptions} [options={}] - Fetch options
   * @returns {Promise<T>} Response data or fallback data
   */
  safeGet: <T = any>(endpoint: string, fallbackData: T, options?: Omit<ApiOptions, "method">) =>
    safeApiFetch<T>(endpoint, fallbackData, { ...options, method: "GET" }),
};

// ============================ Usage Examples =============================

/**
 * 
 // 1. Basic GET Request with Type

interface User {
  id: string;
  name: string;
  email: string;
}

async function fetchUsers() {
  try {
    const users = await api.get<User[]>('/api/users');
    console.log(`Fetched ${users.length} users`);
    return users;
  } catch (error) {
    console.error('Failed to fetch users:', error.message);
    throw error;
  }
}



2. POST Request with Body and Headers

interface CreateProductDto {
  name: string;
  price: number;
  category: string;
}

interface Product extends CreateProductDto {
  id: string;
  createdAt: string;
}

async function createProduct(product: CreateProductDto, authToken: string) {
  try {
    const newProduct = await api.post<Product, CreateProductDto>(
      '/api/products',
      product,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        }
      }
    );
    return newProduct;
  } catch (error) {
    console.error('Product creation failed:', error.message);
    throw error;
  }
}


3. File Upload with FormData

async function uploadProfilePicture(userId: string, file: File) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', userId);

  try {
    const result = await api.post<{ url: string }>(
      '/api/upload/profile',
      formData,
      {
        headers: {
          // Let browser set the Content-Type with boundary
          'Content-Type': undefined,
        }
      }
    );
    return result.url;
  } catch (error) {
    console.error('Upload failed:', error.message);
    throw error;
  }
}



4. PUT Request with Custom Error Handling

interface UpdateUserDto {
  name?: string;
  email?: string;
}

async function updateUser(userId: string, updates: UpdateUserDto) {
  try {
    const updatedUser = await api.put<User, UpdateUserDto>(
      `/api/users/${userId}`,
      updates
    );
    return updatedUser;
  } catch (error) {
    if (error.message.includes('Email already exists')) {
      throw new Error('The email address is already in use');
    }
    throw error;
  }
}


5. DELETE Request with No Response Body

async function deletePost(postId: string) {
  try {
    // Expecting 204 No Content response
    await api.delete<void>(`/api/posts/${postId}`);
    console.log('Post deleted successfully');
  } catch (error) {
    console.error('Failed to delete post:', error.message);
    throw error;
  }
}

6. Override Cache Behavior

// Explicitly allow caching
const cachedData = await api.get('/api/data', { cache: 'force-cache' });

// Or use other cache modes
const revalidatedData = await api.get('/api/data', { 
  cache: 'no-cache' // Revalidate with server
});

'default' – Browser default behavior

'no-store' – Never cache (your new default)

'reload' – Bypass cache but update cache

'no-cache' – Check with server if stale

'force-cache' – Use cache even if stale

'only-if-cached' – Only from cache, no network

7. Safe API Request for Static Generation

// Use safeGet for pages that need to work during static generation
const marketingData = await api.safeGet('/api/marketing/fetchAlbumBymarketing', []);

*/
