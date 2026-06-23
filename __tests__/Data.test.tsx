import { constants } from '../source/constants/Constants';
import { retrieveAssetsChunk } from '../source/data/Data';
import {
  AssetPerformance,
  AssetsSortingOption,
  AssetType,
} from '../source/types/Assets';
import { utilities } from '../source/utilities/Utilities';

const inexistentAssetName = 'inexistent asset name';

describe('Data', () => {
  test(`checks chunk has ${constants.assetsChunkSize} items`, () => {
    expect(
      retrieveAssetsChunk(1, undefined, undefined, undefined, undefined),
    ).toHaveLength(constants.assetsChunkSize);
  });

  test(`checks chunk still has ${constants.assetsChunkSize} items`, () => {
    expect(
      retrieveAssetsChunk(
        500 / constants.assetsChunkSize,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      ),
    ).toHaveLength(constants.assetsChunkSize);
  });

  test('checks chunk has no items', () => {
    expect(
      retrieveAssetsChunk(
        500 / constants.assetsChunkSize + 1,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      ),
    ).toHaveLength(0);
  });

  test(`checks chunk has no items with name "${inexistentAssetName}"`, () => {
    expect(
      retrieveAssetsChunk(
        1,
        undefined,
        inexistentAssetName,
        undefined,
        undefined,
        undefined,
      ),
    ).toHaveLength(0);
  });

  test(`checks chunk has no items with type "${AssetType.crypto}"`, () => {
    expect(
      retrieveAssetsChunk(
        1,
        undefined,
        undefined,
        AssetType.stock,
        undefined,
        undefined,
      ).find(asset => asset.type === AssetType.crypto),
    ).toBeFalsy();
  });

  test(`checks chunk has no items with type "${AssetType.stock}"`, () => {
    expect(
      retrieveAssetsChunk(
        1,
        undefined,
        undefined,
        AssetType.crypto,
        undefined,
        undefined,
      ).find(asset => asset.type === AssetType.stock),
    ).toBeFalsy();
  });

  test(`checks chunk has no items with performance "${AssetPerformance.gainer}"`, () => {
    expect(
      retrieveAssetsChunk(
        1,
        undefined,
        undefined,
        undefined,
        AssetPerformance.looser,
        undefined,
      ).find(asset => utilities.isAssetGainer(asset)),
    ).toBeFalsy();
  });

  test(`checks chunk has no items with performance "${AssetPerformance.looser}"`, () => {
    expect(
      retrieveAssetsChunk(
        1,
        undefined,
        undefined,
        undefined,
        AssetPerformance.gainer,
        undefined,
      ).find(asset => utilities.isAssetLooser(asset)),
    ).toBeFalsy();
  });

  test('checks chunks have no common items', () => {
    const firstChunk = retrieveAssetsChunk(
      1,
      undefined,
      undefined,
      AssetType.crypto,
      AssetPerformance.gainer,
      undefined,
    );

    const secondChunk = retrieveAssetsChunk(
      2,
      undefined,
      undefined,
      AssetType.crypto,
      AssetPerformance.gainer,
      undefined,
    );

    expect(
      secondChunk.find(asset1 =>
        firstChunk.find(asset2 => asset2.id === asset1.id),
      ),
    ).toBeFalsy();
  });

  test(`checks chunks union is ordered by name ascending`, () => {
    const firstChunk = retrieveAssetsChunk(
      1,
      undefined,
      undefined,
      undefined,
      undefined,
      AssetsSortingOption.nameAscending,
    );

    const secondChunk = retrieveAssetsChunk(
      2,
      undefined,
      undefined,
      undefined,
      undefined,
      AssetsSortingOption.nameAscending,
    );

    const thirdChunk = retrieveAssetsChunk(
      3,
      undefined,
      undefined,
      undefined,
      undefined,
      AssetsSortingOption.nameAscending,
    );

    const chunksUnion = [...firstChunk, ...secondChunk, ...thirdChunk];

    const sortedChunksUnion = [...chunksUnion].sort((asset1, asset2) =>
      asset1.name.localeCompare(asset2.name),
    );

    let differencesCount = 0;

    for (let assetIndex = 0; assetIndex < chunksUnion.length; assetIndex++) {
      if (chunksUnion[assetIndex].name !== sortedChunksUnion[assetIndex].name) {
        differencesCount++;
      }
    }

    expect(differencesCount).toEqual(0);
  });
});
