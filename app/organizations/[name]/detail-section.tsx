import { ReactNode } from "react";

// Shared section wrapper so the scope dialogs (details, edit, add) keep the same visual skeleton.
export function DetailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2 rounded-lg border p-3">
      <h3 className="text-xs font-medium uppercase text-muted-foreground">
        {title}
      </h3>
      {children}
    </section>
  );
}
