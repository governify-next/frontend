import { paginationSearchParams } from "@/lib/search/pagination";
import { Pagination } from "@/types/pagination";
import { useQueryStates } from "nuqs";

export function usePaginationParams(pagination?: Pagination) {
  const [, setParams] = useQueryStates(paginationSearchParams, {
    shallow: false,
  });

  const pageIndex =
    (pagination?.page ?? paginationSearchParams.page.defaultValue) - 1; // tanstack is 0-based index
  const pageSize =
    pagination?.limit ?? paginationSearchParams.limit.defaultValue;

  const onPaginationChange = (next: {
    pageIndex: number;
    pageSize: number;
  }) => {
    const pageLimitChanged = next.pageSize !== pageSize;
    setParams({
      limit: next.pageSize,
      page: pageLimitChanged ? 1 : next.pageIndex + 1,
    });
  };

  return {
    pagination: { pageIndex, pageSize },
    pageCount: pagination?.totalPages ?? 0,
    onPaginationChange,
  };
}
