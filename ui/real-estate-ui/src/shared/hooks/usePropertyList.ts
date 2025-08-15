import { useState, useEffect, useCallback, useRef } from "react";
import type { PropertyListDto, PropertyFilterDto } from "../../shared/types/property";
import { fetchPropertyList } from "../../infrastructure/api-client/propertyApi";

export function usePropertyList(initialFilter: PropertyFilterDto) {
  const [filter, setFilter] = useState<PropertyFilterDto>(initialFilter);
  const [properties, setProperties] = useState<PropertyListDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reqIdRef = useRef(0);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    const currentReq = ++reqIdRef.current;

    fetchPropertyList(filter)
      .then((res) => {
        if (currentReq !== reqIdRef.current) return; // stale response
        setProperties(res.data);
        setTotalCount(res.totalCount);
      })
      .catch(() => {
        if (currentReq !== reqIdRef.current) return;
        setError("Liste getirilemedi");
      })
      .finally(() => {
        if (currentReq !== reqIdRef.current) return;
        setLoading(false);
      });
  }, [filter]);

  useEffect(() => {
    refetch();
  }, [filter, refetch]);

  return { properties, totalCount, loading, error, filter, setFilter, refetch };
}
