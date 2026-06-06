import { ScrollView, TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ToolbarProps = {
  onInsert: (toolKey: string) => void;
  activeFormats?: string[];
};

// Config 8 tools
export const TOOLS = [
  { key: 'bold',         display: 'B',   bold: true,   prefix: '**', suffix: '**',    block: false },
  { key: 'italic',       display: 'I',   italic: true, prefix: '*',  suffix: '*',     block: false },
  { key: 'h1',           display: 'H1',  bold: true,   prefix: '# ', suffix: '',      block: true  },
  { key: 'h2',           display: 'H2',  bold: true,   prefix: '## ',suffix: '',      block: true  },
  { key: 'code',         display: '</>', bold: false,   prefix: '`',  suffix: '`',     block: false },
  { key: 'link',         icon: 'link-outline',          prefix: '[',  suffix: '](url)',block: false },
  { key: 'bulletList',   icon: 'list-outline',          prefix: '- ', suffix: '',      block: true  },
  { key: 'numberedList', icon: 'apps-outline',          prefix: '1. ',suffix: '',      block: true  },
] as const;

export function NoteToolbar({ onInsert, activeFormats = [] }: ToolbarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="border-b border-gray-800 bg-black"
      contentContainerStyle={{ paddingHorizontal: 12, gap: 4, alignItems: 'center', height: 44 }}
    >
      {TOOLS.map((tool) => {
        const isActive = activeFormats.includes(tool.key);
        return (
          <TouchableOpacity
            key={tool.key}
            onPress={() => onInsert(tool.key)}
            className={`w-9 h-9 rounded-lg items-center justify-center ${isActive ? 'bg-white' : 'bg-transparent'}`}
            activeOpacity={0.6}
          >
            {'icon' in tool ? (
              <Ionicons
                name={tool.icon as any}
                size={18}
                color={isActive ? '#000000' : '#888888'}
              />
            ) : (
              <Text style={{
                color: isActive ? '#000000' : '#888888',
                fontSize: 13,
                fontWeight: (tool as any).bold ? '700' : '400',
                fontStyle: (tool as any).italic ? 'italic' : 'normal',
              }}>
                {(tool as any).display}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
