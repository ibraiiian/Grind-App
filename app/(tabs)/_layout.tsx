/**
 * GRIND App — Bottom Tab Bar Layout
 * Source: PRD v2.0 Section 6.5, 2.1
 *
 * 5 tabs: Home, Folders, Tasks, Prompts, Profile
 * Style: bg black, height 60, no labels, white active, gray inactive
 * Active indicator: white dot 4px below icon
 * Home tab special: "LET'S GRIND" badge when active
 */

import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { ComponentProps } from 'react';

type IoniconsName = ComponentProps<typeof Ionicons>['name'];

interface TabIconProps {
  name: IoniconsName;
  color: string;
  focused: boolean;
  isHome?: boolean;
}

function TabIcon({ name, color, focused, isHome }: TabIconProps) {
  return (
    <View className="items-center justify-center pt-2">
      <Ionicons name={name} size={24} color={color} />

      {/* Active dot indicator */}
      {focused && (
        <View
          className="rounded-full mt-1"
          style={{
            width: 4,
            height: 4,
            backgroundColor: colors.white,
          }}
        />
      )}

      {/* Home tab special badge */}
      {isHome && focused && (
        <View
          className="absolute -bottom-1 -left-3 border rounded-full px-1.5 py-0.5"
          style={{
            borderColor: colors.gray700,
            backgroundColor: colors.black,
          }}
        >
          <Text
            className="font-bold uppercase"
            style={{
              fontSize: 6,
              color: colors.white,
              letterSpacing: 0.5,
            }}
          >
            let's grind
          </Text>
        </View>
      )}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.black,
          borderTopColor: colors.gray900,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 0,
        },
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: colors.gray500,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home" color={color} focused={focused} isHome />
          ),
        }}
      />
      <Tabs.Screen
        name="folders"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="folder-outline" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="checkbox-outline" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="prompts"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="flash" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="person-outline" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
