import { useState, useCallback } from "react";
import { searchProperties } from "../../infrastructure/api-client/propertyApi";
import type { PropertyListDto } from "../../shared/types/property";

export function usePropertySearch(initialType = "Daire") {
  const [type, setType] = useState(initialType);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<PropertyListDto[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (nextPage = 1) => {
      try {
        setLoading(true);
        setError(null);

        const res = await searchProperties({
          query, // <-- artık query olarak backend’e gidiyor
          page: nextPage,
          pageSize,
        });

        setItems(res.data);
        setTotal(res.totalCount);
        setPage(nextPage);
      } catch {
        setError("Arama sırasında bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    },
    [query, pageSize]
  );

  const onSearch = () => fetchPage(1);
  const onPageChange = (p: number) => fetchPage(p);

  return {
    type,
    setType,
    query,
    setQuery,
    items,
    total,
    page,
    pageSize,
    loading,
    error,
    onSearch,
    onPageChange,
  };
}
