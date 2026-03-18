namespace NodeJS {
  interface ProcessEnv {
    EMAIL_USER: string;
    EMAIL_PASS: string;
    /** Geared Finance Partner API key for server-side calculator API (optional; fallback in route) */
    GEARED_FINANCE_API_KEY?: string;
    NEXT_PUBLIC_FIREBASE_API_KEY: string;
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
    NEXT_PUBLIC_FIREBASE_APP_ID: string;
  }
}
