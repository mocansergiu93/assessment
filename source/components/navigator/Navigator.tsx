import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import HomeScreen from '../../screens/home/HomeScreen';
import AssetDetailsScreen from '../../screens/assetDetails/AssetDetailsScreen';
import { enableScreens } from 'react-native-screens';

enableScreens();

const RootStackNavigator = createNativeStackNavigator({
  initialRouteName: 'Home',
  screenOptions: {
    header: () => undefined,
  },
  screens: {
    Home: HomeScreen,
    AssetDetails: AssetDetailsScreen,
  },
});

const StaticNavigator = createStaticNavigation(RootStackNavigator);

type RootStackNavigatorType = typeof RootStackNavigator;

declare module '@react-navigation/native' {
  interface RootNavigator extends RootStackNavigatorType {}
}

const Navigator: FC = () => {
  return <StaticNavigator />;
};

export default Navigator;
