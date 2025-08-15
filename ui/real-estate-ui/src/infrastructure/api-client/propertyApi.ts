import axiosInstance from "../http/axiosInstance";
import type {
  PropertyFilterDto,
  PropertyFilterResponse,
  PropertyListDto,
  PropertyCreateDto,
  PropertyUpdateDto,
  PropertyDetailDto,
} from "../../shared/types/property";

// Ortak yardımcılar
const toISO = (d?: string | Date | null) =>
  d ? new Date(d).toISOString() : null;

const normalizeUpsert = <T extends { endDate?: string | Date | null }>(p: T) => ({
  ...p,
  endDate: p.endDate ? toISO(p.endDate) : null,
});

type MaybeSignal = { signal?: AbortSignal };

// ---- Arama paramları + sıralama ----
export interface PropertySearchParams {
  propertyTypeId?: number;
  propertyStatusId?: number;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string | null;

  city?: string | null;
  district?: string | null;
  query?: string | null; // Arama kutusu buraya bağlanacak

  page?: number;
  pageSize?: number;
  sortBy?: "price" | "date" | "id";
  sortDir?: "asc" | "desc";
}

// ---- Kullanıcı girişini direkt PropertyFilterDto’ya mapleyen fonksiyon ----
function mapInputToFilter(payload: PropertySearchParams): PropertyFilterDto {
  return {
    page: payload.page ?? 1,
    pageSize: payload.pageSize ?? 20,
    city: payload.city ?? null,
    district: payload.district ?? null,
    query: payload.query ?? null,
  };
}

// ---- Arama ----
export async function searchProperties(
  params: PropertySearchParams,
  opts: MaybeSignal = {}
): Promise<PropertyFilterResponse> {
  const filter = mapInputToFilter(params);
  const { data } = await axiosInstance.post<PropertyFilterResponse>(
    "/property/filter",
    filter,
    opts
  );
  return data;
}

// ---- Filtreli & paginated liste ----
export async function fetchPropertyList(
  filter: PropertyFilterDto,
  opts: MaybeSignal = {}
): Promise<PropertyFilterResponse> {
  const { data } = await axiosInstance.post<PropertyFilterResponse>(
    "/property/filter",
    filter,
    opts
  );
  return data;
}

// ---- Tüm property’ler ----
export async function fetchAllProperties(
  opts: MaybeSignal = {}
): Promise<PropertyListDto[]> {
  const { data } = await axiosInstance.get<PropertyListDto[]>("/property", opts);
  return data;
}

// ---- Detay ----
export async function fetchPropertyById(
  id: number | string,
  opts: MaybeSignal = {}
): Promise<PropertyDetailDto> {
  const { data } = await axiosInstance.get<PropertyDetailDto>(
    `/property/${id}`,
    opts
  );
  return data;
}

// ---- CRUD ----
export async function createProperty(payload: PropertyCreateDto): Promise<void> {
  const body = normalizeUpsert(payload);
  await axiosInstance.post("/property", body);
}

export async function updateProperty(payload: PropertyUpdateDto): Promise<void> {
  const body = normalizeUpsert(payload);
  await axiosInstance.put(`/property/${payload.id}`, body);
}

export async function deleteProperty(id: number): Promise<void> {
  await axiosInstance.delete(`/property/${id}`);
}

// ---- Harita filtresi ----
export async function mapFilter(
  filter: PropertyFilterDto,
  opts: MaybeSignal = {}
): Promise<PropertyListDto[]> {
  const { data } = await axiosInstance.post<PropertyListDto[]>(
    "/property/map-filter",
    filter,
    opts
  );
  return data;
}

// ---- Dashboard özet ----
export interface DashboardSummaryDto {
  totalProperties: number;
  totalForSale: number;
  totalForRent: number;
  avgPrice?: number;
}
export async function fetchDashboardSummary(
  opts: MaybeSignal = {}
): Promise<DashboardSummaryDto> {
  const { data } = await axiosInstance.get<DashboardSummaryDto>(
    "/property/dashboard-summary",
    opts
  );
  return data;
}

// ---- Favoriler ----
export interface FavoriteToggleResult {
  isFavorite: boolean;
}
export async function toggleFavorite(id: number): Promise<FavoriteToggleResult> {
  const { data } = await axiosInstance.post<FavoriteToggleResult>(
    `/favorites/toggle`,
    { propertyId: id }
  );
  return data;
}
export async function fetchFavorites(
  opts: MaybeSignal = {}
): Promise<PropertyListDto[]> {
  const { data } = await axiosInstance.get<PropertyListDto[]>("/favorites", opts);
  return data;
}
