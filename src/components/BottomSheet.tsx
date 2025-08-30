import Colors from '@src/theme/Colors';
import Metrics from '@src/theme/Metrics';
import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

type Props = {};

// Calculate the maximum and minimum height for the bottom sheet
const BOTTOMSHEET_MAX_HEIGHT = Metrics.screen.height * 0.6;
const BOTTOMSHEET_MIN_HEIGHT = Metrics.screen.height * 0.1;

const BottomSheet: React.FC<Props> = ({}) => {
  // Shared value for the current Y translation of the bottom sheet
  const translateY = useSharedValue(0);
  // Shared value to keep track of the last Y translation after gesture ends
  const lastTranslateY = useSharedValue(0);

  // Pan gesture for dragging the bottom sheet
  const panGesture = Gesture.Pan()
    .onUpdate(e => {
      // Update translateY based on gesture movement, clamp within allowed range
      translateY.value = Math.max(
        Math.min(e.translationY + lastTranslateY.value, 0),
        BOTTOMSHEET_MIN_HEIGHT - BOTTOMSHEET_MAX_HEIGHT,
      );
    })
    .onEnd(() => {
      // Calculate threshold to determine if sheet should close or open
      const threshold = (BOTTOMSHEET_MIN_HEIGHT - BOTTOMSHEET_MAX_HEIGHT) / 2;
      if (translateY.value < threshold) {
        // If dragged down more than half, close the sheet
        translateY.value = withSpring(
          BOTTOMSHEET_MIN_HEIGHT - BOTTOMSHEET_MAX_HEIGHT,
        );
        lastTranslateY.value = BOTTOMSHEET_MIN_HEIGHT - BOTTOMSHEET_MAX_HEIGHT;
      } else {
        // Otherwise, open the sheet
        translateY.value = withSpring(0);
        lastTranslateY.value = 0;
      }
    });

  // Animated style for the bottom sheet position
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
    };
  });

  return (
    // GestureDetector wraps the bottom sheet to handle pan gestures
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {/* Decorative line at the top of the bottom sheet */}
        <View style={styles.bottomLine} />
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: BOTTOMSHEET_MAX_HEIGHT,
    position: 'absolute',
    bottom: BOTTOMSHEET_MIN_HEIGHT - BOTTOMSHEET_MAX_HEIGHT,
    left: 0,
    right: 0,
    ...Platform.select({
      android: {elevation: 3},
      ios: {
        shadowColor: Colors.blueLucky,
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  bottomLine: {
    height: 5,
    width: 80,
    backgroundColor: Colors.greySuva,
    borderRadius: 4,
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 8,
  },
});

export default BottomSheet;
