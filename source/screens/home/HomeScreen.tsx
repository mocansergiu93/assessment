import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AssetItem from '../../components/assetItem/AssetItem';
import { constants } from '../../constants/Constants';
import { utilities } from '../../utilities/Utilities';
import {
  Asset,
  AssetPerformance,
  Assets,
  AssetsSortingOption,
  AssetType,
} from '../../types/Assets';
import Dropdown from '../../components/dropdown/Dropdown';
import { DropdownOption } from '../../types/Dropdown';
import { retrieveAssetsChunk } from '../../data/Data';
import { useNavigation } from '@react-navigation/native';

const HomeScreen: FC = () => {
  const { navigate } = useNavigation();
  const [loadedAssets, setLoadedAssets] = useState<Assets>([]);

  const [assetTypeFilter, setAssetTypeFilter] = useState<DropdownOption>({
    id: undefined,
    label: 'None',
  });

  const [assetPerformanceFilter, setAssetPerformanceFilter] =
    useState<DropdownOption>({ id: undefined, label: 'None' });

  const [assetsSortingOption, setAssetsSortingOption] =
    useState<DropdownOption>({ id: undefined, label: 'None' });

  const [loadedChunksCount, setLoadedChunksCount] = useState<number>(1);
  const intervalIdRef = useRef<number | null>(null);
  const flatListRef = useRef<FlatList<Asset> | null>(null);

  useEffect(() => {
    setLoadedAssets(previousAssets => {
      const retreivedAssets = retrieveAssetsChunk(
        loadedChunksCount,
        undefined,
        undefined,
        assetTypeFilter.id as AssetType,
        assetPerformanceFilter.id as AssetPerformance,
        assetsSortingOption.id as AssetsSortingOption,
      );

      return [...previousAssets, ...retreivedAssets];
    });
  }, [
    loadedChunksCount,
    assetTypeFilter.id,
    assetPerformanceFilter.id,
    assetsSortingOption.id,
  ]);

  useEffect(() => {
    intervalIdRef.current = setInterval(() => {
      setLoadedAssets(previousAssets =>
        previousAssets.map(asset => ({
          ...asset,
          currentPrice: parseFloat((Math.random() * 5000 + 10).toFixed(2)),
        })),
      );
    }, constants.assetsPricesChangeIntervalMs);

    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, [loadedAssets]);

  const resetAssets = useCallback(() => {
    setLoadedChunksCount(1);
    setLoadedAssets([]);
    flatListRef.current?.scrollToOffset({ animated: false, offset: 0 });
  }, [flatListRef]);

  const filterAssetsByType = useCallback(
    (assetType: DropdownOption) => {
      resetAssets();
      setAssetTypeFilter(assetType);
    },
    [resetAssets],
  );

  const filterAssetsByPerformance = useCallback(
    (assetPerformance: DropdownOption) => {
      resetAssets();
      setAssetPerformanceFilter(assetPerformance);
    },
    [resetAssets],
  );

  const sortAssetsByOption = useCallback(
    (assetsSortingOption: DropdownOption) => {
      resetAssets();
      setAssetsSortingOption(assetsSortingOption);
    },
    [resetAssets],
  );

  const loadOneMoreAssetsChunk = useCallback(() => {
    setLoadedChunksCount(
      previousLoadedChunksCount => previousLoadedChunksCount + 1,
    );
  }, []);

  const navigateToAssetDetails = useCallback(
    (asset: Asset) => () => {
      navigate('AssetDetails', {
        asset,
        assetType: assetTypeFilter.id as AssetType,
        assetPerformance: assetPerformanceFilter.id as AssetPerformance,
        assetsSortingOption: assetsSortingOption.id as AssetsSortingOption,
      });
    },
    [
      navigate,
      assetTypeFilter.id,
      assetPerformanceFilter.id,
      assetsSortingOption.id,
    ],
  );

  const renderAsset = useCallback(
    ({ item: asset }: { item: Asset }) => (
      <TouchableOpacity onPress={navigateToAssetDetails(asset)}>
        <AssetItem asset={asset} />
      </TouchableOpacity>
    ),
    [navigateToAssetDetails],
  );

  const getAssetLayout = useCallback(
    (_data: ArrayLike<Asset> | null | undefined, index: number) => ({
      length: constants.assetsListItemHeight + constants.assetsListItemMargin,
      offset:
        (constants.assetsListItemHeight + constants.assetsListItemMargin) *
        index,
      index,
    }),
    [],
  );

  const sortingOptions = useMemo(
    () => [
      { id: undefined, label: 'None' },
      ...Object.entries(AssetsSortingOption).map(option => ({
        id: option[0],
        label: utilities.getAssetsSortingOptionLabel(option[1]),
      })),
    ],
    [],
  );

  const typeFilteringOptions = useMemo(
    () => [
      { id: undefined, label: 'None' },
      ...Object.entries(AssetType).map(option => ({
        id: option[0],
        label: utilities.convertStringToCapitalCase(option[1]),
      })),
    ],
    [],
  );

  const performanceFilteringOptions = useMemo(
    () => [
      { id: undefined, label: 'None' },
      ...Object.entries(AssetPerformance).map(option => ({
        id: option[0],
        label: utilities.convertStringToCapitalCase(option[1]),
      })),
    ],
    [],
  );

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Assets</Text>
      </View>
      <View style={styles.configurator}>
        <View style={styles.sorter}>
          <Dropdown
            options={sortingOptions}
            selectedOption={assetsSortingOption}
            onSelectOption={sortAssetsByOption}
            label="Sort by"
          />
        </View>
        <View style={styles.filters}>
          <View style={styles.filter}>
            <Dropdown
              options={typeFilteringOptions}
              selectedOption={assetTypeFilter}
              onSelectOption={filterAssetsByType}
              label="Type"
            />
          </View>
          <View style={styles.filter}>
            <Dropdown
              options={performanceFilteringOptions}
              selectedOption={assetPerformanceFilter}
              onSelectOption={filterAssetsByPerformance}
              label="Performance"
            />
          </View>
        </View>
      </View>
      <FlatList
        keyExtractor={asset => `${asset.id}`}
        data={loadedAssets}
        renderItem={renderAsset}
        style={styles.assets}
        onEndReached={loadOneMoreAssetsChunk}
        onEndReachedThreshold={1}
        getItemLayout={getAssetLayout}
        ref={flatListRef}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 10,
  },
  screenHeader: {
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: {
    color: '#121212',
    fontSize: 24,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  configurator: {
    marginHorizontal: 20,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sorter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  filters: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  filter: {
    marginLeft: 10,
  },
  assets: {
    flex: 1,
    marginTop: 10,
  },
});

export default HomeScreen;
