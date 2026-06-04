import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import * as Clipboard from 'expo-clipboard';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, withDelay, runOnJS } from 'react-native-reanimated';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { parseVariables, parseTemplateSegments, fillTemplate } from '@/lib/prompt-parser';
import { FOLDER_ICONS, FolderIconKey } from '@/constants/icons';

export default function PromptFillModal() {
  const { promptId } = useLocalSearchParams<{ promptId: Id<'aiPrompts'> }>();
  const router = useRouter();
  
  const prompt = useQuery(api.prompts.getPromptById, promptId ? { id: promptId } : 'skip');
  
  const [values, setValues] = useState<Record<string, string>>({});
  const [variables, setVariables] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Snackbar animation values
  const snackbarTranslateY = useSharedValue(100);
  const snackbarOpacity = useSharedValue(0);

  useEffect(() => {
    if (prompt?.promptTemplate) {
      const extractedVars = parseVariables(prompt.promptTemplate);
      setVariables(extractedVars);
      
      // Initialize values state
      const initialValues: Record<string, string> = {};
      extractedVars.forEach(v => { initialValues[v] = ''; });
      setValues(initialValues);
    }
  }, [prompt]);

  const allFilled = variables.length === 0 || variables.every(v => values[v]?.trim().length > 0);
  const filledTemplate = prompt ? fillTemplate(prompt.promptTemplate, values) : '';

  const triggerSnackbar = () => {
    setIsCopied(true);
    snackbarTranslateY.value = withSequence(
      withTiming(0, { duration: 300 }),
      withDelay(2500, withTiming(100, { duration: 300 }))
    );
    snackbarOpacity.value = withSequence(
      withTiming(1, { duration: 300 }),
      withDelay(2500, withTiming(0, { duration: 300 }, (finished) => {
        if (finished) runOnJS(setIsCopied)(false);
      }))
    );
  };

  const handleCopy = async () => {
    if (!prompt) return;
    await Clipboard.setStringAsync(filledTemplate);
    triggerSnackbar();
  };

  if (!prompt) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-gray-500">Loading prompt...</Text>
      </View>
    );
  }

  const iconName = FOLDER_ICONS[prompt.icon as FolderIconKey] || FOLDER_ICONS['star'];
  const segments = parseTemplateSegments(prompt.promptTemplate);

  const snackbarStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: snackbarTranslateY.value }],
    opacity: snackbarOpacity.value,
  }));

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 justify-end bg-black/60"
    >
      <View className="bg-black w-full h-[92%] rounded-t-3xl border-t border-gray-800 relative">
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          
          {/* HANDLE & HEADER */}
          <View className="w-10 h-1 bg-gray-600 rounded-full mx-auto mt-1 mb-6" />
          
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center flex-1">
              <Text className="font-black text-2xl text-white mr-3">fill & copy.</Text>
              <Ionicons name={iconName as any} size={24} color="white" />
            </View>
            <TouchableOpacity onPress={() => router.back()} className="w-8 h-8 items-center justify-center bg-gray-900 rounded-full">
              <Ionicons name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="text-sm text-gray-500 mb-6">{prompt.title} · {variables.length} variables</Text>

          {/* TEMPLATE PREVIEW BOX */}
          <View className="border border-dashed border-gray-600 rounded-xl px-4 py-3 bg-gray-950 mb-6 max-h-[160px]">
            <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
              <Text style={{ fontFamily: Platform.select({ ios: 'Courier New', android: 'monospace', default: 'monospace' }) }}>
                {segments.map((seg, idx) => {
                  if (seg.type === 'text') {
                    return <Text key={idx} className="text-gray-400 text-sm">{seg.content}</Text>;
                  } else {
                    const isFilled = values[seg.name]?.trim().length > 0;
                    return (
                      <Text 
                        key={idx} 
                        className="text-white text-sm"
                        style={{ textDecorationLine: isFilled ? 'none' : 'underline' }}
                      >
                        {isFilled ? values[seg.name] : `{{${seg.name}}}`}
                      </Text>
                    );
                  }
                })}
              </Text>
            </ScrollView>
          </View>

          {/* VARIABLES INPUTS */}
          {variables.length > 0 && (
            <View className="mb-6">
              <View className="flex-row items-center mb-4">
                <Text className="uppercase text-xs font-bold text-gray-500 tracking-wider">FILL IN VARIABLES</Text>
                <Ionicons name="pencil-outline" size={12} color="#6B7280" style={{ marginLeft: 6 }} />
              </View>

              {variables.map(v => {
                const isMultiline = v.includes('code') || v.includes('content') || v.includes('text');
                return (
                  <View key={v} className="mb-4">
                    <Text className="text-xs text-gray-500 mb-2 ml-1">{v}</Text>
                    <TextInput
                      className={`bg-gray-900 border border-gray-700 rounded-xl px-4 text-white text-base ${isMultiline ? 'py-3' : 'h-14'}`}
                      placeholder={v === 'language' ? 'Python, JavaScript, Go...' : v === 'code' ? 'paste your code here...' : v === 'role' ? 'senior engineer, teacher...' : `isi ${v}...`}
                      placeholderTextColor="#6B7280"
                      value={values[v] || ''}
                      onChangeText={(txt) => setValues(prev => ({ ...prev, [v]: txt }))}
                      multiline={isMultiline}
                      textAlignVertical={isMultiline ? 'top' : 'center'}
                      style={isMultiline ? { minHeight: 80 } : undefined}
                    />
                  </View>
                );
              })}
            </View>
          )}

          {/* RESULT PREVIEW FOLD */}
          {variables.length > 0 && allFilled && (
            <View className="mb-8">
              <TouchableOpacity onPress={() => setShowPreview(!showPreview)} className="flex-row items-center mb-3">
                <Text className="text-xs text-gray-500 mr-1">lihat hasil</Text>
                <Ionicons name={showPreview ? "chevron-up" : "chevron-forward"} size={12} color="#6B7280" />
              </TouchableOpacity>
              {showPreview && (
                <View className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <Text 
                    className="text-gray-300 text-sm"
                    style={{ fontFamily: Platform.select({ ios: 'Courier New', android: 'monospace', default: 'monospace' }) }}
                  >
                    {filledTemplate}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* CTA */}
          <TouchableOpacity
            className={`bg-white h-14 rounded-xl items-center justify-center flex-row shadow-sm ${!allFilled ? 'opacity-40' : 'opacity-100'}`}
            disabled={!allFilled}
            onPress={handleCopy}
          >
            <Text className="text-black font-black text-lg mr-2">copy to clipboard</Text>
            <Ionicons name="arrow-forward" size={20} color="black" />
          </TouchableOpacity>
          <Text className="text-center text-xs text-gray-600 mt-3 font-medium">
            paste directly into ChatGPT or Claude
          </Text>

        </ScrollView>

        {/* CUSTOM SNACKBAR TOAST */}
        <Animated.View 
          className="absolute bottom-8 left-6 right-6 items-center pointer-events-none"
          style={snackbarStyle}
        >
          <View className="bg-gray-900 border border-gray-700 rounded-full px-5 py-3 flex-row items-center shadow-lg">
            <Ionicons name="checkmark-circle" color="white" size={18} className="mr-2" />
            <Text className="text-white text-sm font-medium ml-2">copied! paste it anywhere.</Text>
          </View>
        </Animated.View>

      </View>
    </KeyboardAvoidingView>
  );
}
