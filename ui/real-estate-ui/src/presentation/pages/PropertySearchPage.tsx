// src/presentation/pages/PropertySearchPage.tsx
import { Box, Pagination, CircularProgress, Alert, Paper, Typography } from "@mui/material";
import SearchBar from "../components/molecules/SearchBar";
import { usePropertySearch } from "../../shared/hooks/usePropertySearch";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function PropertySearchPage() {
  const [sp, setSp] = useSearchParams();

  const {
    type, setType,
    query, setQuery,
    items, total, page, pageSize,
    loading, error,
    onSearch, onPageChange,
  } = usePropertySearch("Daire");

  // İlk yüklemede URL paramlarına göre state’i kur ve fetch et
  useEffect(() => {
    const urlType = sp.get("type") ?? "Daire";
    const urlQ = sp.get("q") ?? "";
    const urlPage = Number(sp.get("page") ?? 1);

    // State’i URL’den doldur
    let needFetch = false;

    if (urlType !== type) { setType(urlType); needFetch = true; }
    if (urlQ !== query)   { setQuery(urlQ);   needFetch = true; }

    // sayfa 1 değilse veya type/q değiştiyse uygun fetch
    if (urlPage !== page || needFetch) {
      if (urlPage > 1) onPageChange(urlPage);
      else onSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // sadece ilk render’da

  // URL’i güncelleyen yardımcılar (mutate etmeyin: kopya oluşturun)
  const updateSearchParams = (kv: Record<string, string | null>) => {
    const next = new URLSearchParams(sp);
    Object.entries(kv).forEach(([k, v]) => {
      if (v === null || v === "") next.delete(k);
      else next.set(k, String(v));
    });
    setSp(next, { replace: true });
  };

  return (
    <Box sx={{ p: 2 }}>
      <SearchBar
        type={type}
        onTypeChange={(val) => {
          setType(val);
          updateSearchParams({ type: val, page: "1" }); // arama tip değişince sayfayı 1’e çek
        }}
        query={query}
        onQueryChange={(val) => {
          setQuery(val);
          updateSearchParams({ q: val || null, page: "1" }); // boşsa q’yu sil
        }}
        types={["Daire", "Villa", "Arsa"]}
        onSearch={() => {
          // URL zaten güncel; sadece fetch tetikle
          onSearch();
        }}
      />

      {loading && (
        <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box sx={{ mt: 3 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {!loading && !error && (
        <>
          <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
            {items.map((item) => (
              <Paper
                key={item.id}
                elevation={3}
                sx={{
                  flex: "1 1 calc(25% - 16px)",
                  minWidth: 260,
                  maxWidth: 400,
                  p: 2,
                  bgcolor: "#272A45",
                  borderRadius: 2,
                }}
              >
                <Box
                  component="img"
                  src={item.thumbnailUrl || "https://via.placeholder.com/400x240?text=No+Image"}
                  alt={item.title}
                  sx={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 1, mb: 1 }}
                />
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {item.propertyType} • {item.propertyStatus}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {item.price} {item.currency}
                </Typography>
              </Paper>
            ))}
          </Box>

          {total > pageSize && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                page={page}
                count={Math.max(1, Math.ceil(total / pageSize))}
                onChange={(_, p) => {
                  updateSearchParams({ page: String(p) });
                  onPageChange(p);
                }}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
