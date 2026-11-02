import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils/cn";

export function OrganizationAvatar({
  label,
  className,
  fallbackClassName,
}: {
  label: string;
  className?: string;
  fallbackClassName?: string;
}) {
  const initials = label
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <Avatar className={cn("rounded-lg after:rounded-lg", className)}>
      <AvatarFallback className={cn("rounded-lg", fallbackClassName)}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
