import styled from 'styled-components/native';
import { theme } from './theme';

// Common styled components that can be reused across the app
export const Container = styled.View<{ padding?: keyof typeof theme.spacing }>`
  padding: ${({ padding = 'xl' }) => theme.spacing[padding]}px;
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.lg}px;
  margin-bottom: ${theme.spacing.xl}px;
  ${theme.shadows.small};
`;

export const Card = styled.View<{ padding?: keyof typeof theme.spacing }>`
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.lg}px;
  padding: ${({ padding = 'xl' }) => theme.spacing[padding]}px;
  ${theme.shadows.small};
`;

export const Title = styled.Text<{ size?: keyof typeof theme.fontSize }>`
  font-size: ${({ size = 'xxl' }) => theme.fontSize[size]}px;
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.text.primary};
  text-align: center;
  margin-bottom: ${theme.spacing.sm}px;
`;

export const Subtitle = styled.Text<{ size?: keyof typeof theme.fontSize }>`
  font-size: ${({ size = 'lg' }) => theme.fontSize[size]}px;
  color: ${theme.colors.text.secondary};
  text-align: center;
  line-height: ${theme.lineHeight.md}px;
`;

export const Label = styled.Text`
  font-size: ${theme.fontSize.lg}px;
  font-weight: ${theme.fontWeight.semibold};
  margin-bottom: ${theme.spacing.sm}px;
  color: ${theme.colors.text.primary};
`;

export const Input = styled.TextInput<{ hasError?: boolean }>`
  border-width: 1px;
  border-color: ${({ hasError }) => hasError ? theme.colors.destructive : theme.colors.border};
  border-radius: ${theme.borderRadius.md}px;
  padding: ${theme.spacing.md}px;
  font-size: ${theme.fontSize.lg}px;
  background-color: ${theme.colors.background};
  margin-bottom: ${theme.spacing.xs}px;
`;

export const Button = styled.TouchableOpacity<{ 
  variant?: 'primary' | 'secondary' | 'destructive' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  active?: boolean;
}>`
  background-color: ${({ variant = 'primary', disabled, active }) => {
    if (disabled) return theme.colors.secondary;
    if (active && variant === 'primary') return theme.colors.primary;
    switch (variant) {
      case 'destructive': return theme.colors.destructive;
      case 'secondary': return active ? theme.colors.primary : theme.colors.background;
      case 'success': return theme.colors.success;
      default: return theme.colors.primary;
    }
  }};
  padding-horizontal: ${({ size = 'md' }) => 
    size === 'sm' ? theme.spacing.md : 
    size === 'lg' ? theme.spacing.lg : theme.spacing.xl}px;
  padding-vertical: ${({ size = 'md' }) => 
    size === 'sm' ? theme.spacing.sm : 
    size === 'lg' ? theme.spacing.lg : theme.spacing.md}px;
  border-radius: ${theme.borderRadius.md}px;
  align-items: center;
  justify-content: center;
  min-width: ${({ size = 'md' }) => 
    size === 'sm' ? 60 : 
    size === 'lg' ? 120 : 80}px;
  border-width: 1px;
  border-color: ${({ variant = 'primary', active }) => {
    if (active || variant === 'primary') return theme.colors.primary;
    return variant === 'secondary' ? theme.colors.border : 'transparent';
  }};
  margin-top: ${({ size = 'md' }) => 
    size === 'lg' ? theme.spacing.md : 0}px;
`;

export const ButtonText = styled.Text<{ 
  variant?: 'primary' | 'secondary' | 'destructive' | 'success';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
}>`
  color: ${({ variant = 'primary', active }) => {
    if (variant === 'secondary' && !active) return theme.colors.text.primary;
    return theme.colors.text.white;
  }};
  font-size: ${({ size = 'md' }) => 
    size === 'sm' ? theme.fontSize.md : 
    size === 'lg' ? theme.fontSize.xl : theme.fontSize.lg}px;
  font-weight: ${({ active }) => active ? theme.fontWeight.semibold : theme.fontWeight.medium};
  text-align: center;
`;

export const Row = styled.View<{ gap?: keyof typeof theme.spacing; justify?: string }>`
  flex-direction: row;
  align-items: center;
  gap: ${({ gap = 'md' }) => theme.spacing[gap]}px;
  ${({ justify }) => justify && `justify-content: ${justify};`}
`;

export const Column = styled.View<{ gap?: keyof typeof theme.spacing }>`
  gap: ${({ gap = 'md' }) => theme.spacing[gap]}px;
`;

export const Spacer = styled.View<{ size?: keyof typeof theme.spacing }>`
  height: ${({ size = 'md' }) => theme.spacing[size]}px;
`;

export const Overlay = styled.View`
  flex: 1;
  background-color: ${theme.colors.overlay};
  justify-content: center;
  align-items: center;
`;

export const StatusIndicator = styled.View<{ variant?: 'success' | 'error' | 'warning' }>`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${({ variant = 'success' }) => {
    switch (variant) {
      case 'error': return theme.colors.destructive;
      case 'warning': return theme.colors.secondary;
      default: return theme.colors.success;
    }
  }};
`;

export const InputHint = styled.Text`
  font-size: ${theme.fontSize.sm}px;
  color: ${theme.colors.text.secondary};
  font-style: italic;
  line-height: ${theme.lineHeight.sm}px;
`;

export const ConnectedContainer = styled.View`
  background-color: ${theme.colors.shade};
  border-radius: ${theme.borderRadius.md}px;
  border-width: 1px;
  border-color: ${theme.colors.primary};
`;

export const StatusText = styled.Text<{ primary?: boolean }>`
  font-size: ${({ primary }) => primary ? theme.fontSize.lg : theme.fontSize.md}px;
  font-weight: ${({ primary }) => primary ? theme.fontWeight.semibold : theme.fontWeight.normal};
  color: ${({ primary }) => primary ? theme.colors.text.primary : theme.colors.text.secondary};
  margin-bottom: ${({ primary }) => primary ? 2 : 0}px;
`;

// Specialized form components
export const FormContainer = styled.View`
  gap: ${theme.spacing.xl}px;
`;

export const InputContainer = styled.View`
  margin-bottom: ${theme.spacing.lg}px;
`;

export const ToggleButtonGroup = styled.View`
  flex-direction: row;
  gap: ${theme.spacing.md}px;
`;

export const ToggleButton = styled.TouchableOpacity<{ active?: boolean }>`
  flex: 1;
  padding: ${theme.spacing.md}px;
  border-radius: ${theme.borderRadius.md}px;
  border-width: 1px;
  border-color: ${({ active }) => active ? theme.colors.primary : theme.colors.border};
  background-color: ${({ active }) => active ? theme.colors.primary : theme.colors.background};
  align-items: center;
`;

export const ToggleButtonText = styled.Text<{ active?: boolean }>`
  font-size: ${theme.fontSize.lg}px;
  color: ${({ active }) => active ? theme.colors.text.white : theme.colors.text.primary};
  font-weight: ${({ active }) => active ? theme.fontWeight.semibold : theme.fontWeight.normal};
`;

export const LoadingContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${theme.spacing.sm}px;
`;

export const HeaderContainer = styled.View`
  margin-bottom: ${theme.spacing.xxl}px;
  align-items: center;
`;
