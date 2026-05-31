/**
 * GRIND App — Loading Skeleton
 * Source: PRD v2.0 Section 7.5
 *
 * Animated pulse skeleton for loading states.
 * Uses Animated API for pulse effect (cannot use NativeWind for animated opacity).
 */

import { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

interface LoadingSkeletonProps {
  /** Number of skeleton rows to show */
  rows?: number;
}

export function LoadingSkeleton({ rows = 3 }: LoadingSkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  const widths = ['75%', '60%', '85%', '50%', '70%'];

  return (
    <View className="gap-y-3 py-4">
      {Array.from({ length: rows }).map((_, i) => (
        <Animated.View
          key={i}
          className="bg-gray-900 rounded-xl"
          style={{
            opacity,
            height: 56,
            width: widths[i % widths.length],
          }}
        />
      ))}
    </View>
  );
}
