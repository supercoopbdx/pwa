import packageJson from "@/../package.json"
export default {
  version: packageJson.version,
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL_LOCAL || 'http://localhost:8000',
  },
};
