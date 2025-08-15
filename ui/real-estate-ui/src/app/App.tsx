import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ColorModeProvider from "../shared/theme/ColorModeProvider"; 
import { AuthProvider } from "../shared/context/AuthContext";
import { CurrencyProvider } from "../shared/context/CurrencyContext"; // ✅ eklendi
import MainLayout from "../presentation/components/layout/MainLayout";
import AdminLayout from "../presentation/components/layout/AdminLayout";
import LoginPage from "../presentation/pages/LoginPage";
import RegisterPage from "../presentation/pages/RegisterPage";
import HomePage from "../presentation/pages/HomePage";
import FavoritesPage from "../presentation/pages/FavoritesPage";
import PropertyDetailPage from "../presentation/pages/PropertyDetailPage";
import PrivateAdminRoute from "./PrivateAdminRoute";

// Admin pages
import AdminDashboardPage from "../presentation/pages/admin/AdminDashboardPage";
import PropertyListPageAdmin from "../presentation/pages/admin/PropertyListPage";
import AdminPanelPage from "../presentation/pages/admin/AdminPanelPage";
import TypesPage from "../presentation/pages/admin/TypesPage";
import CurrencyPage from "../presentation/pages/admin/CurrencyPage";
import LanguagePage from "../presentation/pages/admin/LanguagePage";

// Public liste sayfası (AppBar -> /emlaklar?status=sale|rent buraya gelir)
import PropertyListPublicPage from "../presentation/pages/PropertyListPublicPage";

import PropertySearchPage from "../presentation/pages/PropertySearchPage";

// FAVORI API ENTEGRASYONU
import { getFavoriteIds, toggleFavorite } from "../infrastructure/api-client/favoriteApi";

export default function App() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favBusy, setFavBusy] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const ids = await getFavoriteIds(); // number[]
        setFavorites(ids.map(String));
      } catch {
        // login değilse 401 gelebilir; sessiz geçiyoruz
      }
    })();
  }, []);

  const handleToggleFavorite = async (id: string) => {
    if (!id || favBusy.includes(id)) return;
    setFavBusy((prev) => [...prev, id]);

    const isFav = favorites.includes(id);
    // optimistic update
    setFavorites((prev) => (isFav ? prev.filter((fid) => fid !== id) : [...prev, id]));

    try {
      await toggleFavorite(Number(id));
    } catch {
      // geri al
      setFavorites((prev) => (isFav ? [...prev, id] : prev.filter((fid) => fid !== id)));
    } finally {
      setFavBusy((prev) => prev.filter((x) => x !== id));
    }
  };

  return (
    <ColorModeProvider>
      <AuthProvider>
        <CurrencyProvider>
          <Routes>
            {/* --- PUBLIC AREA --- */}
            <Route
              path="/"
              element={
                <MainLayout>
                  <HomePage favorites={favorites} onToggleFavorite={handleToggleFavorite} />
                </MainLayout>
              }
            />

            {/* Satılık / Kiralık liste sayfası (public) */}
            <Route
              path="/emlaklar"
              element={
                <MainLayout>
                  <PropertyListPublicPage />
                </MainLayout>
              }
            />

            {/* Kısayol rotalar */}
            <Route path="/satilik" element={<Navigate to="/emlaklar?status=sale" replace />} />
            <Route path="/kiralik" element={<Navigate to="/emlaklar?status=rent" replace />} />

            {/* Arama sayfası */}
            <Route
              path="/search"
              element={
                <MainLayout>
                  <PropertySearchPage />
                </MainLayout>
              }
            />

            {/* FAVORITES: bu sayfa kendi API'sinden çekiyor; props YOK */}
            <Route
              path="/favorites"
              element={
                <MainLayout>
                  <FavoritesPage />
                </MainLayout>
              }
            />

            <Route
              path="/property/:id"
              element={
                <MainLayout>
                  <PropertyDetailPage />
                </MainLayout>
              }
            />

            <Route
              path="/login"
              element={
                <MainLayout>
                  <LoginPage />
                </MainLayout>
              }
            />

            <Route
              path="/register"
              element={
                <MainLayout>
                  <RegisterPage />
                </MainLayout>
              }
            />

            {/* --- ADMIN AREA --- */}
            <Route
              path="/admin"
              element={
                <PrivateAdminRoute>
                  <AdminLayout />
                </PrivateAdminRoute>
              }
            >
              <Route index element={<AdminDashboardPage />} />
              <Route path="properties" element={<PropertyListPageAdmin />} />
              <Route path="param" element={<AdminPanelPage />} />
              <Route path="types" element={<TypesPage />} />
              <Route path="currency" element={<CurrencyPage />} />
              <Route path="i18n" element={<LanguagePage />} />
            </Route>

            {/* (opsiyonel) 404 fallback */}
            {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
          </Routes>
        </CurrencyProvider>
      </AuthProvider>
    </ColorModeProvider>
  );
}
