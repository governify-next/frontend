"use client";

import { useLinkStatus } from "next/link";
import { Spinner } from "@/components/ui/spinner";

export function LinkPendingIcon({ children }: { children: React.ReactNode }) {
  const { pending } = useLinkStatus();
  return pending ? <Spinner /> : children;
}
