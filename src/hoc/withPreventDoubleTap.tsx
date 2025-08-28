import React, {useRef, forwardRef} from 'react';

type WithPress = {
  onPress?: (...args: any[]) => void;
};

export default function withPreventDoubleTap<P extends object>(
  WrappedComponent: React.ComponentType<P>,
) {
  const ComponentWithPreventDoubleTap = forwardRef<any, P & WithPress>(
    (props, ref) => {
      const lastTap = useRef<number>(0);

      const handlePress = (...args: any[]) => {
        const now = Date.now();
        if (now - lastTap.current > 1000) {
          lastTap.current = now;
          props.onPress?.(...args);
        }
      };

      return (
        <WrappedComponent {...(props as P)} ref={ref} onPress={handlePress} />
      );
    },
  );

  ComponentWithPreventDoubleTap.displayName = `withPreventDoubleTap(${
    (WrappedComponent as any).displayName ||
    (WrappedComponent as any).name ||
    'Component'
  })`;

  return ComponentWithPreventDoubleTap;
}
