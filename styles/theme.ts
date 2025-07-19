// Design System Theme
export const theme = {
  colors: {
    primary: '#007AFF',
    secondary: '#8E8E93',
    destructive: '#FF3B30',
    success: '#28a745',
    background: '#fff',
    surface: '#f8f9fa',
    overlay: 'rgba(0, 0, 0, 0.5)',
    text: {
      primary: '#212529',
      secondary: '#6c757d',
      white: '#fff',
    },
    border: '#ced4da',
    shade: '#d1edff',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  borderRadius: {
    sm: 6,
    md: 8,
    lg: 12,
  },
  fontSize: {
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 24,
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: 'bold',
  },
  lineHeight: {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
    xxl: 32,
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
  },
};

export type Theme = typeof theme;
