/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BOT_API_URL: string
    readonly VITE_BOT_LOGIN_PATH: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }