import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
} from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";

export function ItemListSkeleton() {
  return (
    <ItemGroup>
      {Array.from({ length: 5 }).map((_, index) => (
        <Item key={index} variant="outline">
          <ItemMedia>
            <Skeleton className="size-8" />
          </ItemMedia>
          <ItemContent className="min-w-0">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-64" />
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  );
}
