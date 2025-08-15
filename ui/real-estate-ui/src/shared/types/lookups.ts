export interface PropertyTypeDto {
  id: number;
  name: string;
}

export interface PropertyTypeCreateDto {
  name: string;
}
export interface PropertyTypeUpdateDto {
  id: number;
  name: string;
}

export interface CurrencyDto {
  id: number;
  code: string;   // TL, USD, EUR
  symbol: string; // ₺, $, €
}
export interface CurrencyCreateDto {
  code: string;
  symbol: string;
}
export interface CurrencyUpdateDto {
  id: number;
  code: string;
  symbol: string;
}

export interface LanguageDto {
  id: number;
  code: string; // tr, en
  name: string; // Türkçe, English
}
export interface LanguageCreateDto {
  code: string;
  name: string;
}
export interface LanguageUpdateDto {
  id: number;
  code: string;
  name: string;
}
