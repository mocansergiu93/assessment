import financialAssets from '../../financial_assets.json';
import { constants } from '../constants/Constants';
import {
  Assets,
  AssetType,
  AssetPerformance,
  AssetsSortingOption,
} from '../types/Assets';
import { utilities } from '../utilities/Utilities';

const allAssets = financialAssets as Assets;

export const retrieveAssetsChunk = (
  chunkNumber: number,
  assetIdToExclude?: number,
  assetName?: string,
  assetType?: AssetType,
  assetPerformance?: AssetPerformance,
  assetsSortingOption?: AssetsSortingOption,
) => {
  return allAssets
    .filter(asset => {
      let shouldAssetRemain = true;

      if (assetIdToExclude) {
        shouldAssetRemain = asset.id !== assetIdToExclude;
      }

      if (!shouldAssetRemain) {
        return false;
      }

      if (assetName) {
        shouldAssetRemain = asset.name === assetName;
      }

      if (!shouldAssetRemain) {
        return false;
      }

      if (assetType) {
        shouldAssetRemain = asset.type === assetType;
      }

      if (!shouldAssetRemain) {
        return false;
      }

      if (assetPerformance) {
        shouldAssetRemain =
          assetPerformance === AssetPerformance.gainer
            ? utilities.isAssetGainer(asset)
            : utilities.isAssetLooser(asset);
      }

      if (!shouldAssetRemain) {
        return false;
      }

      return shouldAssetRemain;
    })
    .sort((asset1, asset2) => {
      switch (assetsSortingOption) {
        case AssetsSortingOption.nameAscending:
          return asset1.name.localeCompare(asset2.name);

        case AssetsSortingOption.nameDescending:
          return -asset1.name.localeCompare(asset2.name);

        case AssetsSortingOption.performanceAscending:
          return asset1.dailyChangePercent > asset2.dailyChangePercent ? 1 : -1;

        case AssetsSortingOption.performanceDescending:
          return asset1.dailyChangePercent > asset2.dailyChangePercent ? -1 : 1;

        default:
          return 0;
      }
    })
    .slice(
      (chunkNumber - 1) * constants.assetsChunkSize,
      chunkNumber * constants.assetsChunkSize,
    );
};
