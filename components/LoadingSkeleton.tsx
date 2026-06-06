import { View, Animated } from 'react-native';
import { useEffect, useRef } from 'react';

type SkeletonVariant =
  | 'card'
  | 'folder-grid'
  | 'task-list'
  | 'prompt-list'
  | 'note-list'
  | 'profile'
  | 'stats';

type LoadingSkeletonProps = {
  variant?: SkeletonVariant;
  count?: number;
};

function SkeletonBox({
  width,
  height,
  opacity,
  radius = 8,
}: {
  width: number | string;
  height: number;
  opacity: Animated.Value;
  radius?: number;
}) {
  return (
    <Animated.View
      style={{
        width: width as any,
        height,
        borderRadius: radius,
        backgroundColor: '#111111',
        opacity,
      }}
    />
  );
}

export function LoadingSkeleton({
  variant = 'card',
  count = 3,
}: LoadingSkeletonProps) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.9,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  if (variant === 'folder-grid') {
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, padding: 20 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Animated.View
            key={i}
            style={{
              width: '47%',
              aspectRatio: 0.9,
              backgroundColor: '#111111',
              borderRadius: 16,
              opacity,
            }}
          />
        ))}
      </View>
    );
  }

  if (variant === 'task-list') {
    return (
      <View style={{ padding: 20, gap: 12 }}>
        {Array.from({ length: count }).map((_, i) => (
          <View
            key={i}
            style={{
              backgroundColor: '#0A0A0A',
              borderRadius: 12,
              padding: 14,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              borderWidth: 1,
              borderColor: '#1A1A1A',
            }}
          >
            <SkeletonBox width={20} height={20} opacity={opacity} radius={999} />
            <View style={{ flex: 1, gap: 6 }}>
              <SkeletonBox width="70%" height={14} opacity={opacity} />
              <SkeletonBox width="40%" height={11} opacity={opacity} />
            </View>
            <SkeletonBox width={64} height={26} opacity={opacity} radius={8} />
          </View>
        ))}
      </View>
    );
  }

  if (variant === 'prompt-list') {
    return (
      <View style={{ padding: 20, gap: 12 }}>
        {Array.from({ length: count }).map((_, i) => (
          <View
            key={i}
            style={{
              backgroundColor: '#0A0A0A',
              borderRadius: 16,
              padding: 16,
              gap: 10,
              borderWidth: 1,
              borderColor: '#1A1A1A',
            }}
          >
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
              <SkeletonBox width={32} height={32} opacity={opacity} radius={8} />
              <View style={{ flex: 1, gap: 6 }}>
                <SkeletonBox width="60%" height={14} opacity={opacity} />
                <SkeletonBox width="90%" height={11} opacity={opacity} />
                <SkeletonBox width="80%" height={11} opacity={opacity} />
              </View>
              <SkeletonBox width={44} height={20} opacity={opacity} radius={6} />
            </View>
            <SkeletonBox width="100%" height={1} opacity={opacity} />
            <SkeletonBox width="35%" height={12} opacity={opacity} />
          </View>
        ))}
      </View>
    );
  }

  if (variant === 'note-list') {
    return (
      <View style={{ padding: 20, gap: 12 }}>
        {Array.from({ length: count }).map((_, i) => (
          <View
            key={i}
            style={{
              backgroundColor: '#0A0A0A',
              borderRadius: 12,
              padding: 14,
              gap: 8,
              borderWidth: 1,
              borderColor: '#1A1A1A',
            }}
          >
            <SkeletonBox width="55%" height={14} opacity={opacity} />
            <SkeletonBox width="90%" height={11} opacity={opacity} />
            <SkeletonBox width="70%" height={11} opacity={opacity} />
            <SkeletonBox width="25%" height={10} opacity={opacity} />
          </View>
        ))}
      </View>
    );
  }

  if (variant === 'stats') {
    return (
      <View style={{ flexDirection: 'row', gap: 12 }}>
        {[0, 1, 2].map((i) => (
          <Animated.View
            key={i}
            style={{
              flex: 1,
              backgroundColor: '#0A0A0A',
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: 'center',
              gap: 8,
              opacity,
              borderWidth: 1,
              borderColor: '#1A1A1A',
            }}
          >
            <SkeletonBox width={32} height={28} opacity={opacity} />
            <SkeletonBox width={40} height={10} opacity={opacity} />
          </Animated.View>
        ))}
      </View>
    );
  }

  // Default: generic card
  return (
    <View style={{ padding: 20, gap: 12 }}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={{
            backgroundColor: '#0A0A0A',
            borderRadius: 12,
            padding: 14,
            gap: 8,
            borderWidth: 1,
            borderColor: '#1A1A1A',
          }}
        >
          <SkeletonBox width="60%" height={14} opacity={opacity} />
          <SkeletonBox width="85%" height={11} opacity={opacity} />
        </View>
      ))}
    </View>
  );
}
