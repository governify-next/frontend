import { Spinner } from "@/components/ui/spinner";

export default function OrganizationLoading() {
  return (
    <div className="flex justify-center py-24">
      <Spinner className="size-6 text-muted-foreground animate-in fade-in fill-mode-backwards [animation-delay:150ms]" />
    </div>
  );
}
