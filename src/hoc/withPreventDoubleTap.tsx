import React, {useRef} from 'react';

export function withPreventDoubleTap<P>(
  WrappedComponent: React.ComponentType<
    P & {onPress?: (...args: any[]) => void}
  >,
) {
  return (props: P & {onPress?: (...args: any[]) => void}) => {
    const lastTap = useRef<number>(0);

    const handlePress = (...args: any[]) => {
      const now = Date.now();
      if (now - lastTap.current > 1000) {
        // 500ms threshold
        lastTap.current = now;
        props.onPress?.(...args);
      }
    };

    return <WrappedComponent {...props} onPress={handlePress} />;
  };
}
