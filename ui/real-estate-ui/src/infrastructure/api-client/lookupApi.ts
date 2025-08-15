import axiosInstance from "../http/axiosInstance";
import type {
  PropertyTypeDto, PropertyTypeCreateDto, PropertyTypeUpdateDto,
  CurrencyDto, CurrencyCreateDto, CurrencyUpdateDto,
  LanguageDto, LanguageCreateDto, LanguageUpdateDto
} from "../../shared/types/lookups";

// ---- Property Types ----
export async function getPropertyTypes(): Promise<PropertyTypeDto[]> {
  const { data } = await axiosInstance.get<PropertyTypeDto[]>("/propertytypes");
  return data;
}
export async function createPropertyType(payload: PropertyTypeCreateDto): Promise<number> {
  const { data, status } = await axiosInstance.post("/propertytypes", payload);
  // CreatedAtAction ile { id } döndürüyoruz; yoksa status 201 yeter
  return data?.id ?? (status === 201 ? -1 : -1);
}
export async function updatePropertyType(payload: PropertyTypeUpdateDto): Promise<void> {
  await axiosInstance.put(`/propertytypes/${payload.id}`, payload);
}
export async function deletePropertyType(id: number): Promise<void> {
  await axiosInstance.delete(`/propertytypes/${id}`);
}

// ---- Currencies ----
export async function getCurrencies(): Promise<CurrencyDto[]> {
  const { data } = await axiosInstance.get<CurrencyDto[]>("/currencies");
  return data;
}
export async function createCurrency(payload: CurrencyCreateDto): Promise<number> {
  const { data, status } = await axiosInstance.post("/currencies", payload);
  return data?.id ?? (status === 201 ? -1 : -1);
}
export async function updateCurrency(payload: CurrencyUpdateDto): Promise<void> {
  await axiosInstance.put(`/currencies/${payload.id}`, payload);
}
export async function deleteCurrency(id: number): Promise<void> {
  await axiosInstance.delete(`/currencies/${id}`);
}

// ---- Languages ----
export async function getLanguages(): Promise<LanguageDto[]> {
  const { data } = await axiosInstance.get<LanguageDto[]>("/languages");
  return data;
}
export async function createLanguage(payload: LanguageCreateDto): Promise<number> {
  const { data, status } = await axiosInstance.post("/languages", payload);
  return data?.id ?? (status === 201 ? -1 : -1);
}
export async function updateLanguage(payload: LanguageUpdateDto): Promise<void> {
  await axiosInstance.put(`/languages/${payload.id}`, payload);
}
export async function deleteLanguage(id: number): Promise<void> {
  await axiosInstance.delete(`/languages/${id}`);
}
