import {Container, Input} from '@src/components';
// import {useUser} from '@src/hooks/domain/user/useUser';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Button from '@src/components/Button';
import {withDismissKeyboard} from '@src/hoc';
function HomeScreen() {
  const {t} = useTranslation();

  return (
    <Container>
      <View style={styles.flex}>
        <Text>{t('test')}</Text>
        <Input textInputStyle={styles.inputContainer} />
        <Button
          title="Press Me"
          onPress={() => console.log('Button Pressed')}
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

export default withDismissKeyboard(HomeScreen);
