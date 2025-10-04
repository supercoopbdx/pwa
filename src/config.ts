import packageJson from '../package.json'

export default {
  auth: {
    authority: import.meta.env.VITE_OIDC_AUTHORITY,
    client_id: import.meta.env.VITE_OIDC_CLIENT_ID,
    scope: import.meta.env.VITE_OIDC_SCOPE,
  },
  backend: {
    baseURL: import.meta.env.VITE_BACKEND_BASEURL,
  },
  version: packageJson.version,
}
