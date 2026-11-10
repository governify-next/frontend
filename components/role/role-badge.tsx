import { IRole } from "@/types/organization";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

export function RoleBadge({
  role,
  className,
}: {
  role: IRole;
  className?: string;
}) {
  return (
    <Badge
      variant="tinted"
      className={cn("min-w-0 capitalize", className)}
      style={{ color: role.color }}
    >
      <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-current" />
      <span className="truncate">{role.name}</span>
    </Badge>
  );
}
