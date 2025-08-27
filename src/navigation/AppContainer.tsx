import {ProfileScreen} from '../screens/profile';
import HomeScreen from '../screens/home';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomBarStack from './BottomBarStack';
import {NavigationContainer} from '@react-navigation/native';
const Stack = createNativeStackNavigator();

const AppContainer = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="MainTab" component={BottomBarStack} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppContainer;
