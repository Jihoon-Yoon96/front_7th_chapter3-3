const isDev = import.meta.env.DEV;
const BASE_URL = isDev ? "/api" : "https://dummyjson.com";

interface RequestOptions extends Omit<RequestInit, 'body'> {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: object | BodyInit;
}

export const callAPI = async <T>(endpoint: string, options?: RequestOptions): Promise<T> => {
  const config: RequestInit = {
    method: options?.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  };

  if (options?.body) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};