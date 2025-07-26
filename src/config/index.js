const config = {
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://backend.supercoopp.fr',
    baseURLLocal: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  },
};

export default config;
