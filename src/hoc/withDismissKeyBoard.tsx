import React from 'react';
import {Keyboard, TouchableWithoutFeedback} from 'react-native';

export function withDismissKeyboard<P>(
  WrappedComponent: React.ComponentType<P>
) {
  const ComponentWithDismissKeyboard = (props: P) => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <WrappedComponent {...props} />
    </TouchableWithoutFeedback>
  );

  ComponentWithDismissKeyboard.displayName = `withDismissKeyboard(${
    (WrappedComponent as any).displayName ||
    (WrappedComponent as any).name ||
    'Component'
  })`;

  return ComponentWithDismissKeyboard;
}
