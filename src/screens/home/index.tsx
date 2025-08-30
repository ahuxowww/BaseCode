import {Container, Input} from '@src/components';
// import {useUser} from '@src/hooks/domain/user/useUser';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Button from '@src/components/Button';
import {Svgs} from '@src/assets';
import Switch from '@src/components/Switch';
import CalendarExpandable from '@src/components/Calendar';
import {withDismissKeyBoard} from '@src/hoc';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '@src/navigation/types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
function HomeScreen() {
  const {t} = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const onNavigateToSurvey = () => {
    navigation.navigate('Survey');
  };

  return (
    <Container>
      <View style={styles.flex}>
        <Text>{t('test')}</Text>
        <Input textInputStyle={styles.inputContainer} />
        <Button title="Press Me" onPress={onNavigateToSurvey} />
        <Svgs.Search height={24} width={24} fill={'red'} />
        <Switch
          labelOn="On"
          labelOff="Off"
          isSwitch={false}
          onChangeSwitch={() => {}}
        />
        <CalendarExpandable
          onNextMonth={(date: Date) => {}}
          onPressDay={(date: Date) => {}}
          onPrevMonth={(date: Date) => {}}
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  inputContainer: {
    marginHorizontal: 16,
  },
});

export default withDismissKeyBoard(HomeScreen);
