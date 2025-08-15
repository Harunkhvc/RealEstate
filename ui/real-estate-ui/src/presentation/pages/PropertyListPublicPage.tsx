// src/presentation/pages/PropertyListPublicPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Stack,
  Pagination,
} from "@mui/material";
import { fetchPropertyList } from "../../infrastructure/api-client/propertyApi";
import type { PropertyListDto } from "../../shared/types/property";
import { useTranslation } from "react-i18next";

const PAGE_SIZE = 20;
const toStatusId = (v: string | null): 1 | 2 | undefined =>
  v === "sale" ? 1 : v === "rent" ? 2 : undefined;

export default function PropertyListPublicPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const statusParam = params.get("status"); // "sale" | "rent" | null
  const pageParam = Number(params.get("page") || 1);

  const statusId = useMemo(() => toStatusId(statusParam), [statusParam]);

  const [items, setItems] = useState<PropertyListDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const title = useMemo(() => {
    if (statusId === 1) return t("listPublic.titles.sale", { defaultValue: "Satılık İlanlar" });
    if (statusId === 2) return t("listPublic.titles.rent", { defaultValue: "Kiralık İlanlar" });
    return t("listPublic.titles.all", { defaultValue: "Tüm İlanlar" });
  }, [statusId, t]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetchPropertyList({
          propertyStatusId: statusId,
          page: pageParam,
          pageSize: PAGE_SIZE,
        });
        if (!alive) return;
        setItems(res.data);
        setTotalCount(res.totalCount);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [statusId, pageParam]);

  const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const handlePageChange = (_: any, p: number) => {
    params.set("page", String(p));
    setParams(params, { replace: true });
  };

  const handleCardClick = (id: number) => navigate(`/property/${id}`);

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          {title}
        </Typography>
        <Typography sx={{ color: "text.secondary" }}>({totalCount})</Typography>
      </Stack>

      {loading ? (
        <CircularProgress />
      ) : items.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          {t("common.noRecords", { defaultValue: "Kayıt bulunamadı." })}
        </Paper>
      ) : (
        <>
          {/* CSS Grid - responsive sütunlar */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 2,
            }}
          >
            {items.map((p) => (
              <Paper
                key={p.id}
                onClick={() => handleCardClick(p.id)}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  overflow: "hidden",
                  cursor: "pointer",
                  "&:hover": { boxShadow: 6 },
                }}
              >
                <Box
                  sx={{
                    height: 160,
                    bgcolor: "#f5f5f5",
                    borderRadius: 2,
                    backgroundImage: `url(${p.thumbnailUrl || ""})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    mb: 1,
                  }}
                />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }} noWrap>
                  {p.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {p.propertyType} • {p.propertyStatus}
                </Typography>
                <Typography variant="subtitle2" sx={{ mt: 0.5, fontWeight: 800 }}>
                  {p.price.toLocaleString(i18n.language === "tr" ? "tr-TR" : "en-US")} {p.currency}
                </Typography>
              </Paper>
            ))}
          </Box>

          {pageCount > 1 && (
            <Stack alignItems="center" sx={{ mt: 3 }}>
              <Pagination
                count={pageCount}
                page={pageParam}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
              />
            </Stack>
          )}
        </>
      )}
    </Box>
  );
}
