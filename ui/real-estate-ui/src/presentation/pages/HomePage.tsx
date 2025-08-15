import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import BannerWithSearchBar from "../components/organisms/BannerWithSearchBar";
import FilterPanel from "../components/organisms/FilterPanel";
import PropertyList from "../components/organisms/PropertyList";
import { fetchPropertyList } from "../../infrastructure/api-client/propertyApi";
import type { PropertyListDto } from "../../shared/types/property";
import { Pagination } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useCurrency } from "../../shared/context/CurrencyContext";

interface HomePageProps {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

const PAGE_SIZE = 12;

// Güvenli sayıya çevirici (sayısal değilse undefined)
const toNum = (v?: string | null): number | undefined => {
  if (!v || !v.trim()) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

// Label->ID dönüştürücü (Türkçe label desteği)
const TYPE_LABEL_TO_ID: Record<string, number> = {
  daire: 1,
  villa: 2,
  arsa: 3,
};
const STATUS_LABEL_TO_ID: Record<string, number> = {
  satılık: 1,
  kiralık: 2,
};
const valueToId = (
  value: string | undefined,
  dict: Record<string, number>
): number | undefined => {
  if (!value) return undefined;
  const n = toNum(value);
  if (typeof n === "number") return n; // zaten ID
  const key = value.trim().toLowerCase();
  return dict[key] ?? undefined;
};

// Türkçe-uyumlu normalize (diakritik ve noktalama farklarını azalt)
const trNormalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

// Döviz kurları (örnek değerler)
const rates: Record<string, number> = {
  TRY: 1,
  USD: 0.036,
  EUR: 0.033,
  GBP: 0.028,
};

// Banner arama tipleri için anahtarlar
const TYPE_KEYS = ["apartment", "villa", "land"] as const;
type TypeKey = typeof TYPE_KEYS[number];

export default function HomePage({ favorites, onToggleFavorite }: HomePageProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currency } = useCurrency();

  // Sol panel inputları
  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    type: "",   // "1"/"2"/"3" veya "Daire"/"Villa"/"Arsa"
    status: "", // "1"/"2" veya "Satılık"/"Kiralık"
  });
  // Uygulanan filtreler (Apply sonrası sabitlenir)
  const [appliedFilters, setAppliedFilters] = useState(filters);

  // Banner’daki global arama
  const [searchTypeKey, setSearchTypeKey] = useState<TypeKey>("apartment");
  const [searchQuery, setSearchQuery] = useState("");

  // Server-side liste & paging
  const [rows, setRows] = useState<PropertyListDto[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Dil bazlı label listesi
  const typeLabels = TYPE_KEYS.map((k) =>
    t(`types.${k}`, k === "apartment" ? "Daire" : k === "villa" ? "Villa" : "Arsa")
  );
  const currentTypeLabel = t(
    `types.${searchTypeKey}`,
    searchTypeKey === "apartment" ? "Daire" : searchTypeKey === "villa" ? "Villa" : "Arsa"
  );

  // Apply -> yeni filtreleri uygula ve sayfayı 1’e al
  const handleApply = () => {
    if (
      filters.minPrice &&
      filters.maxPrice &&
      Number(filters.minPrice) > Number(filters.maxPrice)
    ) {
      alert(t("filterErrors.minGreaterThanMax", "Min fiyat, max fiyattan büyük olamaz."));
      return;
    }
    setAppliedFilters(filters);
    setPage(1);
  };

  // Server payload (adres boşsa backend filtreleyemeyebilir; client-side fallback aşağıda)
  const buildPayload = () => ({
    propertyTypeId: valueToId(appliedFilters.type, TYPE_LABEL_TO_ID),
    propertyStatusId: valueToId(appliedFilters.status, STATUS_LABEL_TO_ID),
    minPrice: toNum(appliedFilters.minPrice),
    maxPrice: toNum(appliedFilters.maxPrice),
    addressContains: appliedFilters.location?.trim() || undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchPropertyList(buildPayload());
      setRows(res.data);
      setTotal(res.totalCount);
    } finally {
      setLoading(false);
    }
  };

  // İlk yükleme + filtre/page değişiminde yükle
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedFilters, page]);

  // --- Client-side fallback: Lokasyon eşleştirme (title/city/district üzerinden) ---
  const displayRows = useMemo(() => {
    const loc = appliedFilters.location?.trim();
    if (!loc) return rows;

    const q = trNormalize(loc); // "kadıkçy" gibi hatalara tolerans
    return rows.filter((p) => {
      const title = trNormalize(p.title || "");
      const city = trNormalize((p as any).city || "");
      const district = trNormalize((p as any).district || "");
      return (
        title.includes(q) ||
        city.includes(q) ||
        district.includes(q)
      );
    });
  }, [rows, appliedFilters.location]);

  // Banner "Ara" → /search
  const handleGlobalSearch = () => {
    const typeParam = encodeURIComponent(searchTypeKey);
    const qParam = encodeURIComponent(searchQuery.trim());
    navigate(`/search?type=${typeParam}&q=${qParam}&page=1`);
  };

  // Banner'dan gelen label'ı tekrar key'e çevir
  const handleTypeChangeByLabel = (label: string) => {
    const idx = typeLabels.indexOf(label);
    if (idx >= 0) setSearchTypeKey(TYPE_KEYS[idx]);
  };

  return (
    <div>
      <BannerWithSearchBar
        type={currentTypeLabel}
        onTypeChange={handleTypeChangeByLabel}
        query={searchQuery}
        onQueryChange={setSearchQuery}
        types={typeLabels}
        onSearch={handleGlobalSearch}
      />

      <div style={{ display: "flex", gap: 24, padding: "24px 0" }}>
        <div style={{ minWidth: 240 }}>
          <FilterPanel
            values={filters}
            onChange={(field, value) => setFilters((f) => ({ ...f, [field]: value }))}
            onApply={handleApply}
          />
        </div>

        <div style={{ flex: 1 }}>
          {loading ? (
            <div>{t("common.loading", "Yükleniyor…")}</div>
          ) : (
            <>
              <PropertyList
                properties={displayRows.map((p) => ({
                  id: p.id.toString(),
                  title: p.title,
                  price: Number((p.price * (rates[currency] || 1)).toFixed(2)),
                  location: "",
                  image: p.thumbnailUrl,
                }))}
                favorites={favorites}
                onToggleFavorite={onToggleFavorite}
              />
              <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
                <Pagination
                  count={Math.max(1, Math.ceil((appliedFilters.location ? displayRows.length : total) / PAGE_SIZE))}
                  page={page}
                  onChange={(_, newPage) => setPage(newPage)}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
