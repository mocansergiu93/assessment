export enum AssetType {
  stock = 'stock',
  crypto = 'crypto',
}

export enum AssetPerformance {
  gainer = 'gainer',
  looser = 'looser',
}

export enum AssetsSortingOption {
  nameAscending = 'nameAscending',
  nameDescending = 'nameDescending',
  performanceAscending = 'performanceAscending',
  performanceDescending = 'performanceDescending',
}

export interface Asset {
  id: number;
  name: string;
  symbol: string;
  type: AssetType;
  currentPrice: number;
  dailyChangePercent: number;
}

export type Assets = Asset[];
