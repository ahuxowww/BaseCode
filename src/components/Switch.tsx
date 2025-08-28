import {withPreventDoubleTap} from '@src/hoc';
import Colors from '@src/theme/Colors';
import React, {useEffect} from 'react';
import {StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import Animated, {
  interpolateColor,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  useDerivedValue,
} from 'react-native-reanimated';

interface SwitchProps {
  isSwitch: boolean;
  onChangeSwitch?: () => void;
  disabled?: boolean;
  labelOn?: string;
  labelOff?: string;
  label?: string;
}

const Switch = ({
  isSwitch,
  onChangeSwitch,
  disabled,
  labelOff,
  labelOn,
}: SwitchProps) => {
  const switchTranslate = useSharedValue(isSwitch ? 22 : 0);
  const progress = useDerivedValue(() => {
    return withTiming(isSwitch ? 22 : 0);
  });

  useEffect(() => {
    if (isSwitch) {
      switchTranslate.value = 22;
    } else {
      switchTranslate.value = 0;
    }
  }, [isSwitch, switchTranslate]);

  const customSpringStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(switchTranslate.value, {
            mass: 1,
            damping: 15,
            stiffness: 100,
            overshootClamping: true,
          }),
        },
      ],
    };
  });

  const backgroundColorStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 22],
      [Colors.greySuva, Colors.blueMaya],
    );
    return {
      backgroundColor,
    };
  });

  const animatedText = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(22 - switchTranslate.value, {
            mass: 1,
            damping: 15,
            stiffness: 100,
            overshootClamping: true,
          }),
        },
      ],
    };
  });

  const disabledStyle = disabled ? {opacity: 0.4} : {};

  const PreventTouchable = withPreventDoubleTap(TouchableWithoutFeedback);

  return (
    <View style={styles.row}>
      <PreventTouchable onPress={onChangeSwitch} disabled={disabled}>
        <Animated.View
          style={[styles.container, backgroundColorStyle, disabledStyle]}>
          <Animated.View style={[styles.textContainer, animatedText]}>
            <Text style={styles.label}>{isSwitch ? labelOn : labelOff}</Text>
          </Animated.View>
          <Animated.View style={[styles.circle, customSpringStyles]} />
        </Animated.View>
      </PreventTouchable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 46,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.whiteSmoke,
    paddingHorizontal: 1,
    flexDirection: 'row',
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.white,
    shadowColor: Colors.blueLucky20,
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 2,
    position: 'absolute',
    left: 1,
  },
  textContainer: {
    flex: 1,
    position: 'absolute',
    left: 0,
    width: 24,
    alignItems: 'center',
  },
  opacity: {
    opacity: 0.4,
  },
  label: {
    fontSize: 12,
    color: Colors.white,
  },
  row: {
    flexDirection: 'row',
  },
});

export default Switch;
