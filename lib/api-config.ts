export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://dermavision-mvx5.onrender.com";

export const getApiUrl = (endpoint: string) => {
  const base = API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
};
