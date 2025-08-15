// src/shared/types/property.ts

export interface PropertyListDto {
  id: number;
  title: string;
  propertyType: string;
  propertyStatus: string;
  price: number;
  currency: string;
  thumbnailUrl: string;
  startDate: string;
  endDate?: string;
  adress?:string
}

export interface PropertyFilterDto {
  propertyTypeId?: number;
  propertyStatusId?: number;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string | null;
  city?: string | null;
  district?: string | null;
  query?: string | null;
  page: number;
  pageSize: number;
}



export interface PropertyFilterResponse {
  totalCount: number;
  page: number;
  pageSize: number;
  data: PropertyListDto[];
}

export interface PropertyTableRow {
  id: number;                // Table’da string olarak tutmak daha rahat, mapping’de çeviriyoruz
  title: string;
  propertyType: string;
  propertyStatus: string;
  price: number;
  currency: string;
  startDate: string;
  endDate?: string;
  thumbnailUrl: string;
}

export interface PropertyCreateDto {
  title: string;
  description: string;
  price: number;
  currencyId: number;
  propertyTypeId: number;
  propertyStatusId: number;
  startDate: string;
  endDate?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  photoUrls?: string[];
}

// (İsteğe bağlı) Güncelleme işlemleri için
export interface PropertyUpdateDto extends PropertyCreateDto {
  id: number;
}

export interface PropertyDetailDto {
  id: number;
  title: string;
  description: string;
  price: number;
  propertyType: string;
  propertyStatus: string;
  currency: string;
  address?: string;
  startDate: string;
  endDate?: string;
  thumbnailUrl?: string;
  photoUrls?: string[];

  m2Brut?: number;
  m2Net?: number;
  roomCount?: string;
  floor?: string;
  buildingAge?: number;

  ownerName?: string;
  ownerPhone?: string;
  latitude?: number;
  longitude?: number;
}
