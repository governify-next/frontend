"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useQueryParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setParams = useCallback(
    (values: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", "1");
      for (const [key, value] of Object.entries(values)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  return { searchParams, setParams };
}
