/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base da API GCEI (ex.: http://localhost:3000). Definida em .env.local */
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
