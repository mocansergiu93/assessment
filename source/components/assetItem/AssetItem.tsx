import { FC, memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { utilities } from '../../utilities/Utilities';
import { Asset } from '../../types/Assets';
import { constants } from '../../constants/Constants';

interface Props {
  asset: Asset;
}

const AssetItem: FC<Props> = memo(
  ({ asset }) => {
    return (
      <View style={styles.assetItem}>
        <View style={styles.assetTitle}>
          <Text style={styles.assetName}>{asset.name}</Text>
          <Text style={styles.assetSymbol}>({asset.symbol})</Text>
        </View>
        <View style={styles.assetValues}>
          <Text style={styles.assetPrice}>{asset.currentPrice}$</Text>
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
      </View>
    );
  },
  (previousProps, nextProps) =>
    previousProps.asset.currentPrice === nextProps.asset.currentPrice,
);

const styles = StyleSheet.create({
  assetItem: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#e3e3e3',
    marginHorizontal: 20,
    marginBottom: constants.assetsListItemMargin,
    borderRadius: 10,
    height: constants.assetsListItemHeight,
  },
  assetTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  assetName: {
    color: '#121212',
    fontSize: 12,
    fontWeight: 'bold',
  },
  assetSymbol: {
    color: '#121212',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  assetValues: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  assetPrice: {
    color: '#121212',
    fontSize: 14,
  },
  assetDpc: {
    color: '#121212',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default AssetItem;
