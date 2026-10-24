import { SearchFilter } from "@/components/filter/search";

export function OrganizationFilters() {
  return (
    <SearchFilter
      placeholder="Search organizations"
      maxLength={200}
      className="sm:max-w-sm"
    />
  );
}
