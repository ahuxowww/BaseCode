import React from 'react';
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

export default function withDismissKeyboard<
  P extends React.JSX.IntrinsicAttributes,
>(WrappedComponent: React.ComponentType<P>) {
  const ComponentWithDismissKeyboard = (props: P) => (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
      accessible={false}>
      <View style={styles.flex}>
        <WrappedComponent {...props} />
      </View>
    </TouchableWithoutFeedback>
  );

  ComponentWithDismissKeyboard.displayName = `withDismissKeyboard(${
    (WrappedComponent as any).displayName ||
    (WrappedComponent as any).name ||
    'Component'
  })`;

  return ComponentWithDismissKeyboard;
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
