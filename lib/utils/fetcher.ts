import { Pagination } from "@/types/user.types";
import { getAccessToken } from "../auth/session";
import { getLogger } from "./logger";

/**
 * This is a wrapper around the fetch that centralizes boilerplate code
 */

export type Result<T> =
  | { ok: true; data: T; pagination?: Pagination }
  | { ok: false; error: string; status: number };

const logger = getLogger().setTag("utils.fetcher.ts");

export const apiFetcher = async <T>(
  url: string,
  options: Omit<RequestInit, "body"> & { body?: unknown } & {
    skipAuth?: boolean;
  },
): Promise<Result<T>> => {
  const token = await getAccessToken();
  let response;

  try {
    response = await fetch(url, {
      method: options.method,
      headers: {
        ...(options.skipAuth ? {} : { Authorization: `Bearer ${token}` }),
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch (error) {
    logger.error(
      `Unexpected error while fetching data from url: ${url}.`,
      error,
    );
    return {
      ok: false,
      error: "Network error. Please try again later.",
      status: 503,
    };
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage = body?.message || "Unknown error while fetching data.";

    if (response.status >= 500) {
      logger.error(
        `Failed to fetch data from url: ${url}. Error: ${errorMessage}.`,
      );
    }
    return {
      ok: false,
      error: errorMessage,
      status: response.status,
    };
  }

  return {
    ok: true,
    data: body?.data as T,
    pagination: body?.pagination as Pagination,
  };
};
