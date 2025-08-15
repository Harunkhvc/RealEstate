// src/shared/types/dashboard.ts

export interface TypeCountDto {
  propertyType: string;
  count: number;
}

export interface StatusCountDto {
  propertyStatus: string;
  count: number;
}

export interface DashboardSummaryDto {
  totalProperties: number;
  totalForSale: number;
  totalForRent: number;
  propertyTypeCounts: TypeCountDto[];
  propertyStatusCounts: StatusCountDto[];
  totalPortfolioValue: number;
}
