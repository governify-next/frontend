import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserAvatar({
  name,
  src,
  className,
}: {
  name: string;
  src?: string | null;
  className?: string;
}) {
  return (
    <Avatar className={className}>
      {src && <AvatarImage src={src} alt={name} />}
      <AvatarFallback>
        {name.trim().charAt(0).toUpperCase() || "U"}
      </AvatarFallback>
    </Avatar>
  );
}
