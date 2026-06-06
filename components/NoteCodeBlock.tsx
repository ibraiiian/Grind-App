import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';

type NoteCodeBlockProps = {
  content: string;
  language?: string;
};

export function NoteCodeBlock({ content, language }: NoteCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={{
      backgroundColor: '#0A0A0A',
      borderRadius: 8,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: '#1A1A1A',
      overflow: 'hidden',
    }}>
      {/* Top bar: language label + copy button */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#1A1A1A',
      }}>
        <Text style={{ color: '#555555', fontSize: 11 }}>
          {language ?? 'code'}
        </Text>
        <TouchableOpacity onPress={handleCopy} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Ionicons
            name={copied ? 'checkmark' : 'copy-outline'}
            size={13}
            color={copied ? '#FFFFFF' : '#555555'}
          />
          <Text style={{ color: copied ? '#FFFFFF' : '#555555', fontSize: 11 }}>
            {copied ? 'copied' : 'copy'}
          </Text>
        </TouchableOpacity>
      </View>
      {/* Code content */}
      <Text style={{
        color: '#EEEEEE',
        fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
        fontSize: 13,
        lineHeight: 20,
        padding: 12,
      }}>
        {content}
      </Text>
    </View>
  );
}
