const LOCAL = true;
let config;

if (LOCAL) {
  config = {
    api: {
      baseURL: import.meta.env.VITE_API_BASE_URL_LOCAL || 'http://localhost:8000',
    },
  };
} else {
  config = {    
    api: {
      baseURL: import.meta.env.VITE_API_BASE_URL || 'https://backend.supercoopp.fr',
    },
  };
}
export default config;
