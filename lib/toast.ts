import Toast from 'react-native-toast-message';

export const toast = {
  success: (title: string, subtitle?: string) =>
    Toast.show({ type: 'success', text1: title, text2: subtitle }),

  error: (title: string, subtitle?: string) =>
    Toast.show({ type: 'error', text1: title, text2: subtitle }),

  info: (title: string, subtitle?: string) =>
    Toast.show({ type: 'info', text1: title, text2: subtitle }),

  copied: () =>
    Toast.show({
      type: 'success',
      text1: 'copied! paste it anywhere.',
      position: 'bottom',
      visibilityTime: 2500,
    }),

  comingSoon: () =>
    Toast.show({
      type: 'info',
      text1: 'Coming soon!',
      text2: 'Fitur ini akan tersedia segera.',
    }),
};
