const DEFAULT_API_URL = "http://127.0.0.1:8000";

export function getApiUrl(): string {
  if (typeof window === "undefined") {
    return process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL;
  }

  return process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL;
}
