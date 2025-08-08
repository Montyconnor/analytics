// Frontend configuration
export const config = {
  // API Key for authentication - should match the server's API_KEY
  API_KEY: import.meta.env.VITE_API_KEY || "your-secure-api-key-here",

  // Base URL for API calls
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "/api",

  // Development settings
  isDevelopment: import.meta.env.DEV,
};

// Helper function to create authenticated fetch options
export const createAuthHeaders = (): HeadersInit => ({
  "Content-Type": "application/json",
  "X-API-Key": config.API_KEY,
});

// Helper function for authenticated API calls
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
) => {
  const authHeaders = createAuthHeaders();

  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      ...authHeaders,
      ...options.headers,
    },
  };

  return fetch(url, fetchOptions);
};
