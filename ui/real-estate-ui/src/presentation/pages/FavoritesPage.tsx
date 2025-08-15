// src/presentation/pages/FavoritesPage.tsx
import { useEffect, useState, useCallback, useMemo } from "react";
import PropertyList from "../components/organisms/PropertyList";
import {
  getFavoriteIds,
  getFavoriteProperties,
  toggleFavorite,
  type PropertyListItem,
} from "../../infrastructure/api-client/favoriteApi";

type UIProperty = {
  id: string;
  title: string;
  price: number;
  location: string;          // PropertyList bekliyorsa boş da olsa veriyoruz
  thumbnailUrl: string;      // Admin sayfadakiyle aynı alan adı
  image: string;             // Kart image bekliyorsa eşitlensin
};

export default function FavoritesPage() {
  const [properties, setProperties] = useState<PropertyListItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyIds, setBusyIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  // İlk yüklemede dataları al
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [propsRes, idsRes] = await Promise.all([
          getFavoriteProperties(),
          getFavoriteIds(),
        ]);
        if (!mounted) return;
        setProperties(propsRes);
        setFavorites(idsRes);
      } catch {
        setError("Favoriler yüklenemedi.");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // optimistic toggle
  const onToggleFavorite = useCallback(
    async (id: number | string) => {
      const numId = typeof id === "string" ? parseInt(id, 10) : id;
      if (!numId || busyIds.includes(numId)) return;

      setBusyIds((prev) => [...prev, numId]);

      const isFav = favorites.includes(numId);
      // optimistic UI
      setFavorites((prev) =>
        isFav ? prev.filter((x) => x !== numId) : [...prev, numId]
      );
      // Favoriler sayfasında kaldırılırsa listeden de düş
      if (isFav) {
        setProperties((prev) => prev.filter((p: any) => p.id !== numId));
      }

      try {
        const res = await toggleFavorite(numId);
        const shouldBeFav = res.added === true;
        setFavorites((prev) => {
          const has = prev.includes(numId);
          if (shouldBeFav && !has) return [...prev, numId];
          if (!shouldBeFav && has) return prev.filter((x) => x !== numId);
          return prev;
        });
      } catch {
        // hata -> geri al
        setFavorites((prev) =>
          isFav ? [...prev, numId] : prev.filter((x) => x !== numId)
        );
      } finally {
        setBusyIds((prev) => prev.filter((x) => x !== numId));
      }
    },
    [favorites, busyIds]
  );

  // PropertyListPage’deki gibi thumbnailUrl kullan; ayrıca image da ayarla
  const uiProps: UIProperty[] = useMemo(
    () =>
      (properties as any[]).map((p) => {
        const thumb = p.thumbnailUrl ?? p.image ?? "";
        return {
          id: String(p.id),
          title: p.title,
          price: p.price,
          location: p.location ?? "",     // yoksa boş ver
          thumbnailUrl: thumb,            // admin listedeki alan adıyla aynı
          image: thumb,                   // kart image bekliyorsa problemsiz olsun
        };
      }),
    [properties]
  );

  if (loading) return <div style={{ padding: 32, fontWeight: 600 }}>Yükleniyor…</div>;
  if (error) return <div style={{ padding: 32, color: "tomato", fontWeight: 600 }}>{error}</div>;

  const favCount = uiProps.length;

  return (
    <div style={{ padding: "32px 0", maxWidth: 1200, margin: "0 auto" }}>
      {/* Başlık */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 16,
          gap: 12,
        }}
      >
        <h2 style={{ margin: 0 }}>Favorilerim</h2>
        <span
          style={{
            fontSize: 13,
            padding: "6px 10px",
            borderRadius: 999,
            border: "1px solid #eee",
            background: "#fafafa",
          }}
        >
          {favCount} kayıt
        </span>
      </div>

      {/* Liste */}
      <div
        style={{
          background: "#fff",
          padding: 12,
          borderRadius: 12,
          border: "1px solid #eee",
        }}
      >
        <PropertyList
          properties={uiProps as any}              
          favorites={favorites.map(String)}
          onToggleFavorite={(id: string) => onToggleFavorite(id)}
        />
      </div>

      {/* Empty state */}
      {uiProps.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: 48,
            color: "#6b7280",
            border: "1px dashed #e5e7eb",
            borderRadius: 12,
            marginTop: 16,
            background:
              "repeating-linear-gradient(45deg, #fafafa, #fafafa 10px, #ffffff 10px, #ffffff 20px)",
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
            Henüz favori eklenmedi
          </div>
          <div style={{ fontSize: 14 }}>
            Beğendiğin ilanların kalp ikonuna tıklayarak burada toplarsın.
          </div>
        </div>
      )}
    </div>
  );
}
