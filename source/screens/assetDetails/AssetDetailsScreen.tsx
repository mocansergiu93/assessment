import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Asset,
  AssetPerformance,
  Assets,
  AssetsSortingOption,
  AssetType,
} from '../../types/Assets';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { utilities } from '../../utilities/Utilities';
import { constants } from '../../constants/Constants';
import { retrieveAssetsChunk } from '../../data/Data';
import AssetItem from '../../components/assetItem/AssetItem';

type Props = StaticScreenProps<{
  asset: Asset;
  assetType?: AssetType;
  assetPerformance?: AssetPerformance;
  assetsSortingOption?: AssetsSortingOption;
}>;

const AssetDetailsScreen: FC<Props> = ({
  route: {
    params: { asset, assetType, assetPerformance, assetsSortingOption },
  },
}) => {
  const { goBack } = useNavigation();

  const [assetCurrentPrice, setAssetCurrentPrice] = useState<number>(
    () => asset.currentPrice,
  );

  const [similarAssets, setSimilarAssets] = useState<Assets>([]);
  const [loadedChunksCount, setLoadedChunksCount] = useState<number>(1);
  const intervalIdRef = useRef<number | null>(null);

  useEffect(() => {
    setSimilarAssets(previousAssets => {
      const retreivedAssets = retrieveAssetsChunk(
        loadedChunksCount,
        asset.id,
        asset.name,
        assetType,
        assetPerformance,
        assetsSortingOption,
      );

      return [...previousAssets, ...retreivedAssets];
    });
  }, [
    loadedChunksCount,
    asset.id,
    asset.name,
    assetType,
    assetPerformance,
    assetsSortingOption,
  ]);

  useEffect(() => {
    intervalIdRef.current = setInterval(() => {
      setAssetCurrentPrice(parseFloat((Math.random() * 5000 + 10).toFixed(2)));

      setSimilarAssets(previousAssets =>
        previousAssets.map(asset => ({
          ...asset,
          currentPrice: parseFloat((Math.random() * 5000 + 10).toFixed(2)),
        })),
      );
    }, constants.assetsPricesChangeIntervalMs);

    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, [asset, similarAssets]);

  const capitalisedAssetType = useMemo(
    () => utilities.convertStringToCapitalCase(asset.type),
    [asset.type],
  );

  const loadOneMoreAssetsChunk = useCallback(() => {
    setLoadedChunksCount(
      previousLoadedChunksCount => previousLoadedChunksCount + 1,
    );
  }, []);

  const renderAsset = useCallback(
    ({ item: asset }: { item: Asset }) => <AssetItem asset={asset} />,
    [],
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

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.screenHeader}>
        <TouchableOpacity style={styles.backScreenNavigator} onPress={goBack}>
          <Text style={styles.backScreenNavigatorLabel}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>
          {asset.name} ({asset.symbol})
        </Text>
      </View>
      <View style={styles.assetDetails}>
        <Text style={styles.assetType}>Type: {capitalisedAssetType}</Text>
        <Text style={styles.assetPrice}>Price: {assetCurrentPrice}$</Text>
        <Text style={styles.assetDpc}>
          DPC:{' '}
          <Text
            style={{
              color: utilities.isAssetGainer(asset)
                ? 'green'
                : utilities.isAssetLooser(asset)
                ? 'red'
                : undefined,
            }}
          >
            {asset.dailyChangePercent}%
          </Text>
        </Text>
      </View>
      <View style={styles.similarAssets}>
        <Text style={styles.similarAssetsTitle}>Similar</Text>
        <FlatList
          keyExtractor={asset => `${asset.id}`}
          data={similarAssets}
          renderItem={renderAsset}
          style={styles.assets}
          onEndReached={loadOneMoreAssetsChunk}
          onEndReachedThreshold={1}
          getItemLayout={getAssetLayout}
        />
      </View>
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
    position: 'relative',
  },
  backScreenNavigator: {
    position: 'absolute',
    left: 0,
    paddingRight: 10,
    paddingVertical: 10,
  },
  backScreenNavigatorLabel: {
    fontSize: 21,
    fontWeight: 'bold',
  },
  screenTitle: {
    color: '#121212',
    fontSize: 24,
    fontWeight: 'bold',
  },
  assetDetails: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  assetType: {
    color: '#121212',
    fontSize: 20,
    marginTop: 10,
  },
  assetPrice: {
    color: '#121212',
    fontSize: 20,
    marginTop: 10,
  },
  assetDpc: {
    color: '#121212',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  similarAssets: {
    flex: 1,
    marginTop: 20,
  },
  similarAssetsTitle: {
    color: '#121212',
    fontSize: 22,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 10,
  },
  assets: {
    flex: 1,
    marginTop: 10,
  },
});

export default AssetDetailsScreen;
