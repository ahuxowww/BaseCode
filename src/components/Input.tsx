import Colors from '@src/theme/Colors';
import React, {useEffect} from 'react';
import {View, StyleSheet, TextInput, ViewStyle, Keyboard} from 'react-native';

interface Props {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  containerStyle?: ViewStyle;
  textInputStyle?: ViewStyle;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
}
export const Input: React.FC<Props> = ({
  value,
  onChangeText,
  placeholder,
  containerStyle,
  textInputStyle,
  rightIcon,
  leftIcon,
}) => {
  useEffect(() => {
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      Keyboard.dismiss();
    });
    return () => {
      hideSubscription.remove();
    };
  }, []);
  return (
    <View style={containerStyle}>
      {leftIcon ? leftIcon : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={[styles.container, textInputStyle]}
        placeholderTextColor={Colors.greyNightRider}
      />
      {rightIcon ? rightIcon : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: Colors.greySuva,
    borderRadius: 8,
    paddingLeft: 8,
    paddingVertical: 8,
  },
});
