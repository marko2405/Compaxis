import type { Season } from "@/types/season";
import { getApiUrl } from "@/services/api-url";

export class SeasonServiceError extends Error {
  readonly status: number | undefined;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "SeasonServiceError";
    this.status = status;
  }
}

export async function getSeasons(): Promise<Season[]> {
  let response: Response;

  try {
    response = await fetch(new URL("/seasons", getApiUrl()), { cache: "no-store" });
  } catch {
    throw new SeasonServiceError("The seasons service is unavailable.");
  }

  if (!response.ok) {
    throw new SeasonServiceError(
      `The seasons request failed with status ${response.status}.`,
      response.status,
    );
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload) || !payload.every(isSeason)) {
    throw new SeasonServiceError("The seasons response is invalid.");
  }

  return payload;
}

function isSeason(value: unknown): value is Season {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Season).id === "number" &&
    typeof (value as Season).code === "string" &&
    typeof (value as Season).name === "string"
  );
}
