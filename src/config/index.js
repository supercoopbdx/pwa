let config;
const LOCAL = import.meta.env.VITE_LOCAL === 'true'
console.log(LOCAL)
if (LOCAL) {
  config = {
    api: {
      baseURL: import.meta.env.VITE_API_BASE_URL_LOCAL || 'http://localhost:8000',
    },
  };
} else {
  config = {    
    api: {
      baseURL: import.meta.env.VITE_API_BASE_URL || 'https://backend.supercoop.fr',
    },
  };
}
export default config;
