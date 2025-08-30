import {NavigatorScreenParams} from '@react-navigation/native';

export type RootStackParamList = {
  Survey: undefined;
  app: NavigatorScreenParams<BottomBarStackParamList>;
};

export type BottomBarStackParamList = {
  Home: undefined;
  Profile: undefined;
};
