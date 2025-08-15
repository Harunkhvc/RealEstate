// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  tr: {
    translation: {
      // Header / Auth
      title: "Harun Emlak",
      forSale: "Satılık",
      forRent: "Kiralık",
      forSeason: "Sezonluk Kiralık",
      projects: "Projeler",
      login: "Giriş Yap",
      logout: "Çıkış",
      signup: "Üye Ol",
      or: "veya",
      lang: "TR",
      user: "Giriş Yap veya Üye Ol",

      // FilterPanel
      filter: "Filtrele",
      location: "Lokasyon",
      minPrice: "Fiyat (Min)",
      maxPrice: "Fiyat (Max)",
      apply: "Uygula",
      type: "Tip",
      status: "Durum",
      all: "Hepsi",
      reset: "Sıfırla",

      // AdminLayout / genel
      admin: { adminPanelTitle: "Harun Emlak Admin Panel" },
      theme: { light: "Aydınlık tema", dark: "Karanlık tema", toggle: "Temayı değiştir" },

      // Roll & Genel Aksiyonlar
      roles: { admin: "Admin", user: "Kullanıcı" },
      actions: { logout: "Çıkış yap", cancel: "İptal", save: "Kaydet" },

      // AdminSidebar
      sidebar: {
        dashboard: "Dashboard",
        properties: "Emlaklar",
        types: "Emlak Tipleri",
        currency: "Döviz",
        language: "Dil",
      },

      // Appbar
      favorites: "Favorilerim",
      profile: "Profil",

      // Banner
      banner: {
        title: "Tam istediğin <highlight>evi</highlight>, kolayca bul",
        features: {
          updatedListings: "Güncel ilanlar",
          verifiedSellers: "Doğrulanmış satıcılar",
          mapSearch: "Harita ile ara",
          noCommission: "Komisyon yok*",
        },
        searchPlaceholder: "Şehir, ilçe, mahalle veya anahtar kelime yazın…",
        searchAria: "emlak arama",
        searchButton: "Ara",
        noCommissionNote:
          "*Komisyon yok: Kampanyaya dahil ilanlarda geçerlidir. Detaylar için şartlar ve koşullara bakın.",
      },

      // Tabs (TAB_OPTIONS anahtarlarıyla eşleşmeli)
      tabs: {
        sale: "Satılık",
        rent: "Kiralık",
        project: "Projeler",
        daily: "Günlük",
        seasonal: "Sezonluk",
      },

      map: {
        title: "Konum",
        noInfo: "Konum bilgisi yok.",
        close: "Kapat",
      },

      owner: {
        title: "İlan sahibi",
        sendMessage: "Mesaj Gönder",
      },

      photoUpload: { upload: "Fotoğraf Yükle" },

      priceAndDates: {
        price: "Fiyat",
        startDate: "Başlangıç Tarihi",
        endDate: "Bitiş Tarihi",
      },

      propertyMeta: { type: "Tip", status: "Durum", currency: "Döviz" },

      propertyTable: {
        photo: "Foto",
        title: "Başlık",
        type: "Tip",
        status: "Durum",
        price: "Fiyat",
        date: "Tarih",
        actions: "İşlemler",
        edit: "Düzenle",
        delete: "Sil",
      },

      searchBar: {
        placeholder: "Konum, ilan no ya da firma adıyla arayın",
        search: "Ara",
      },

      gallery: {
        mainAlt: "İlan görseli",
        thumbAlt: "Küçük önizleme {{n}}",
        prev: "Önceki görsel",
        next: "Sonraki görsel",
      },

      param: {
        titles: {
          types: "Emlak Tipleri",
          statuses: "Emlak Durumları",
          currencies: "Döviz Türleri",
        },
        add: {
          types: "Tip Ekle",
          statuses: "Durum Ekle",
          currencies: "Döviz Ekle",
        },
      },

      // Property Detail
      detail: {
        showOnMap: "Haritada Göster",
        goBack: "Geri Dön",
        addToFavorites: "Favorilere Ekle",
        notFound: "İlan bulunamadı.",
        addedToFavorites: "Favorilere eklendi.",
        addToFavoritesError: "Favorilere eklenemedi.",
        labels: {
          listingId: "İlan No",
          listingDate: "İlan Tarihi",
          propertyType: "Emlak Tipi",
          grossM2: "m² (Brüt)",
          netM2: "m² (Net)",
          roomCount: "Oda Sayısı",
          buildingAge: "Bina Yaşı",
          floor: "Kat",
          address: "Adres",
        },
      },

      propertyForm: {
        createTitle: "Yeni Emlak",
        updateTitle: "Emlak Güncelle",
        title: "Başlık",
        description: "Açıklama",
        address: "Adres",
      },

      types: {
        apartment: "Daire",
        villa: "Villa",
        land: "Arsa",
      },

      filterErrors: {
        minGreaterThanMax: "Min fiyat, max fiyattan büyük olamaz.",
      },

      // Public List sayfası başlıkları
      listPublic: {
        titles: {
          all: "Tüm İlanlar",
          sale: "Satılık İlanlar",
          rent: "Kiralık İlanlar",
        },
      },

      common: {
        loading: "Yükleniyor…",
        notSpecified: "Belirtilmemiş",
        noRecords: "Kayıt bulunamadı.",
      },

      property: {
        detailButton: "Detay"
      },


   propertyTypes: {
    "apartment": "Daire",
    "villa": "Villa",
    "land": "Arsa"
  },

  propertyStatuses: {
    "forSale": "Satılık",
    "forRent": "Kiralık"
  },

      // Dil etiketleri
      langSwitch: { tr: "TR", en: "EN" },
    },
  },

  en: {
    translation: {
      // Header / Auth
      title: "Harun Estate",
      forSale: "For Sale",
      forRent: "For Rent",
      forSeason: "Seasonal Rent",
      projects: "Projects",
      login: "Login",
      logout: "Logout",
      signup: "Sign Up",
      or: "or",
      lang: "EN",
      user: "Login or Sign Up",

      // FilterPanel
      filter: "Filter",
      location: "Location",
      minPrice: "Price (Min)",
      maxPrice: "Price (Max)",
      apply: "Apply",
      type: "Type",
      status: "Status",
      all: "All",
      reset: "Reset",

      // AdminLayout / common
      admin: { adminPanelTitle: "Harun Estate Admin Panel" },
      theme: { light: "Light theme", dark: "Dark theme", toggle: "Toggle theme" },

      // Roles & Common Actions
      roles: { admin: "Admin", user: "User" },
      actions: { logout: "Logout", cancel: "Cancel", save: "Save" },

      // AdminSidebar
      sidebar: {
        dashboard: "Dashboard",
        properties: "Properties",
        types: "Property Types",
        currency: "Currency",
        language: "Language",
      },

      // Appbar
      favorites: "Favorites",
      profile: "Profile",

      // Banner
      banner: {
        title: "Find your <highlight>home</highlight> easily",
        features: {
          updatedListings: "Updated listings",
          verifiedSellers: "Verified sellers",
          mapSearch: "Search on map",
          noCommission: "No commission*",
        },
        searchPlaceholder: "Type city, district, neighborhood or keyword…",
        searchAria: "property search",
        searchButton: "Search",
        noCommissionNote:
          "*No commission: Applies to campaign listings. See terms and conditions for details.",
      },

      // Tabs (must match TAB_OPTIONS keys)
      tabs: {
        sale: "For Sale",
        rent: "For Rent",
        project: "Projects",
        daily: "Daily",
        seasonal: "Seasonal",
      },

      map: {
        title: "Location",
        noInfo: "No location information.",
        close: "Close",
      },

      owner: {
        title: "Listing owner",
        sendMessage: "Send Message",
      },

      photoUpload: { upload: "Upload Photo" },

      priceAndDates: {
        price: "Price",
        startDate: "Start Date",
        endDate: "End Date",
      },

      propertyMeta: { type: "Type", status: "Status", currency: "Currency" },

      propertyTable: {
        photo: "Photo",
        title: "Title",
        type: "Type",
        status: "Status",
        price: "Price",
        date: "Date",
        actions: "Actions",
        edit: "Edit",
        delete: "Delete",
      },

      searchBar: {
        placeholder: "Search by location, listing ID, or company name",
        search: "Search",
      },

      gallery: {
        mainAlt: "Listing image",
        thumbAlt: "Thumbnail preview {{n}}",
        prev: "Previous image",
        next: "Next image",
      },

      param: {
        titles: {
          types: "Property Types",
          statuses: "Property Statuses",
          currencies: "Currencies",
        },
        add: {
          types: "Add Type",
          statuses: "Add Status",
          currencies: "Add Currency",
        },
      },

      // Property Detail
      detail: {
        showOnMap: "Show on Map",
        goBack: "Go Back",
        addToFavorites: "Add to Favorites",
        notFound: "Listing not found.",
        addedToFavorites: "Added to favorites.",
        addToFavoritesError: "Couldn't add to favorites.",
        labels: {
          listingId: "Listing ID",
          listingDate: "Listing Date",
          propertyType: "Property Type",
          grossM2: "m² (Gross)",
          netM2: "m² (Net)",
          roomCount: "Room Count",
          buildingAge: "Building Age",
          floor: "Floor",
          address: "Address",
        },
      },

      propertyForm: {
        createTitle: "New Property",
        updateTitle: "Update Property",
        title: "Title",
        description: "Description",
        address: "Address",
      },

      types: {
        apartment: "Apartment",
        villa: "Villa",
        land: "Land",
      },

      filterErrors: {
        minGreaterThanMax: "Min price cannot be greater than max price.",
      },

      // Public List page titles
      listPublic: {
        titles: {
          all: "All Listings",
          sale: "For Sale Listings",
          rent: "For Rent Listings",
        },
      },

      common: {
        loading: "Loading…",
        notSpecified: "Not specified",
        noRecords: "No records found.",
      },
      property: {
        detailButton: "Details"
      },


      propertyTypes: {
    "apartment": "Apartment",
    "villa": "Villa",
    "land": "Land"
  },
  propertyStatuses: {
    "forSale": "For Sale",
    "forRent": "For Rent"
  },
   


      // Language labels
      langSwitch: { tr: "TR", en: "EN" },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "tr", // default language
  fallbackLng: "tr",
  interpolation: { escapeValue: false },
});

export default i18n;
