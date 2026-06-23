import { Asset, AssetsSortingOption } from '../types/Assets';

export const utilities = {
  convertStringToCapitalCase: (string: string) =>
    string[0].toUpperCase() + string.slice(1),
  isAssetGainer: (asset: Asset) => asset.dailyChangePercent > 0,
  isAssetLooser: (asset: Asset) => asset.dailyChangePercent < 0,
  getAssetsSortingOptionLabel: (option: AssetsSortingOption) => {
    switch (option) {
      case AssetsSortingOption.nameAscending:
        return 'Name (asc)';
      case AssetsSortingOption.nameDescending:
        return 'Name (desc)';
      case AssetsSortingOption.performanceAscending:
        return 'DPC (asc)';
      case AssetsSortingOption.performanceDescending:
        return 'DPC (desc)';
    }
  },
};
