import {Dimensions} from 'react-native';
import {isTablet} from 'react-native-device-info';

const {height, width} = Dimensions.get('screen');
const {height: windowHeight, width: windowWidth} = Dimensions.get('window');

export default {
  isTablet: isTablet(),
  screen: {
    height,
    width,
  },
  window: {
    height: windowHeight,
    width: windowWidth,
  },
};
