export const config = {
    get apiUrl(): string {
      if (!import.meta.env.VITE_API_URL) {
        throw new Error('VITE_API_URL is not set in environment variables');
      }
      return import.meta.env.VITE_API_URL;
    }
  };
  
  // Optional: Export individual variables for easier access
  export const API_URL = config.apiUrl;
