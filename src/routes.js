import { createAppContainer, createStackNavigator } from 'react-navigation';
import React from 'react';
import { Image } from 'react-native';

import Feed from './Pages/Feed';
import New from './Pages/New';

import Logo from './assets/logo.png';

export default createAppContainer(
  createStackNavigator(
    {
      Feed,
      New,
    },
    {
      defaultNavigationOptions: {
        headerTitle: <Image style={{ marginHorizontal: 20 }} source={Logo} />,
        headerBackTitle: null,
        headerTintColor: '#000',
      },
      mode: 'modal',
    },
  ),
);
