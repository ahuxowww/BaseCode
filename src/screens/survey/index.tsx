import {useNavigation} from '@react-navigation/native';
import {Container} from '@src/components';
import BottomSheet from '@src/components/BottomSheet';
import Button from '@src/components/Button';
import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

const SurveyScreen = () => {
  const navigation = useNavigation();
  const onGoBack = () => {
    navigation.goBack();
  };
  return (
    <Container>
      <View style={styles.container}>
        <Button title="Go Back" onPress={onGoBack} />
        <Text>Survey Screen</Text>
      </View>
      <BottomSheet />
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SurveyScreen;
