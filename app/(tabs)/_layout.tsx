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
import { colors } from '@/constants/colors';

import HomeIcon from '@/assets/svg/icons/home.svg';
import FolderIcon from '@/assets/svg/icons/folder.svg';
import CheckSquareIcon from '@/assets/svg/icons/check-square.svg';
import ZapIcon from '@/assets/svg/icons/zap.svg';
import UserIcon from '@/assets/svg/icons/user.svg';

interface TabIconProps {
  IconComponent: any;
  color: string;
  focused: boolean;
  isHome?: boolean;
}

function TabIcon({ IconComponent, color, focused, isHome }: TabIconProps) {
  return (
    <View className="items-center justify-center pt-2">
      <IconComponent width={24} height={24} color={color} />

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
            <TabIcon IconComponent={HomeIcon} color={color} focused={focused} isHome />
          ),
        }}
      />
      <Tabs.Screen
        name="folders"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon IconComponent={FolderIcon} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon IconComponent={CheckSquareIcon} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="prompts"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon IconComponent={ZapIcon} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon IconComponent={UserIcon} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
