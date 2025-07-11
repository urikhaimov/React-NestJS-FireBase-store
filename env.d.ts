/// <reference types="vite/client" />

// Extend this interface with your custom env variables as needed
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_OTHER_ENV?: string;
  // add more env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
