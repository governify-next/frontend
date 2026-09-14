"use client";
import { Result } from "@/lib/utils/fetcher";
import { Frown, House, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

export function ErrorPage<T>({
  result,
  message,
}: {
  result: Extract<Result<T>, { ok: false }>;
  message: string;
}) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-background">
      <Frown className="size-15 text-primary" strokeWidth={1.5} />

      <div className="flex flex-col gap-2 items-center">
        <h2 className="text-xl font-semibold max-w-lg text-center">
          {message}
        </h2>
        <div className="flex items-center gap-2 max-w-sm">
          <p className="font-mono text-sm text-muted-foreground">
            {result.status}
          </p>
          <Separator orientation="vertical" className="h-auto self-stretch" />
          <p className="text-left text-muted-foreground">{result.error}</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => router.push("/")}>
          <House /> Ir al inicio
        </Button>
        <Button onClick={() => router.refresh()}>
          <RotateCw /> Reintentar
        </Button>
      </div>
    </div>
  );
}
