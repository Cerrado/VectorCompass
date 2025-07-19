import React from 'react';
import { 
  FormContainer,
  InputContainer,
  Label,
  Input,
  InputHint,
  ToggleButtonGroup,
  ToggleButton,
  ToggleButtonText,
  Button,
  ButtonText,
  LoadingContainer
} from '../styles/components';
import { ActivityIndicator } from 'react-native';

export interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  hint?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  hasError?: boolean;
}

export interface ToggleFieldProps {
  label: string;
  options: { label: string; value: string; icon?: string }[];
  selectedValue: string;
  onValueChange: (value: string) => void;
}

export interface SubmitButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'destructive' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
}

// Reusable Form Field Component
export const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  hint,
  secureTextEntry = false,
  autoCapitalize = 'none',
  autoCorrect = false,
  hasError = false,
}) => (
  <InputContainer>
    <Label>{label}</Label>
    <Input
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      autoCapitalize={autoCapitalize}
      autoCorrect={autoCorrect}
      hasError={hasError}
    />
    {hint && <InputHint>{hint}</InputHint>}
  </InputContainer>
);

// Reusable Toggle Field Component
export const ToggleField: React.FC<ToggleFieldProps> = ({
  label,
  options,
  selectedValue,
  onValueChange,
}) => (
  <InputContainer>
    <Label>{label}</Label>
    <ToggleButtonGroup>
      {options.map((option) => (
        <ToggleButton
          key={option.value}
          active={selectedValue === option.value}
          onPress={() => onValueChange(option.value)}
        >
          <ToggleButtonText active={selectedValue === option.value}>
            {option.icon && `${option.icon} `}{option.label}
          </ToggleButtonText>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  </InputContainer>
);

// Reusable Submit Button Component
export const SubmitButton: React.FC<SubmitButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  loadingText = 'Loading...',
  variant = 'primary',
  size = 'lg',
  icon,
}) => (
  <Button
    variant={variant}
    size={size}
    disabled={disabled || loading}
    onPress={onPress}
  >
    {loading ? (
      <LoadingContainer>
        <ActivityIndicator color="#ffffff" size="small" />
        <ButtonText variant={variant} size={size}>{loadingText}</ButtonText>
      </LoadingContainer>
    ) : (
      <ButtonText variant={variant} size={size}>
        {icon && `${icon} `}{title}
      </ButtonText>
    )}
  </Button>
);

// Reusable Form Wrapper
export const Form: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <FormContainer>{children}</FormContainer>
);
