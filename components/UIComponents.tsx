import React from 'react';
import { 
  Row, 
  Column, 
  StatusIndicator, 
  StatusText, 
  ConnectedContainer,
  Button,
  ButtonText,
  Card,
  Title,
  Subtitle
} from '../styles/components';

export interface ConnectionStatusProps {
  isConnected: boolean;
  title: string;
  subtitle?: string;
  onDisconnect?: () => void;
  disconnectButtonText?: string;
}

export interface InfoCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export interface DataCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

// Reusable Connection Status Component
export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
  title,
  subtitle,
  onDisconnect,
  disconnectButtonText = 'Disconnect'
}) => {
  if (!isConnected) return null;

  return (
    <ConnectedContainer>
      <Row gap="md" style={{ padding: 16, justifyContent: 'space-between' }}>
        <Row gap="md" style={{ flex: 1 }}>
          <StatusIndicator variant="success" />
          <Column gap="xs">
            <StatusText primary>{title}</StatusText>
            {subtitle && <StatusText>{subtitle}</StatusText>}
          </Column>
        </Row>
        {onDisconnect && (
          <Button variant="destructive" size="sm" onPress={onDisconnect}>
            <ButtonText variant="destructive" size="sm">{disconnectButtonText}</ButtonText>
          </Button>
        )}
      </Row>
    </ConnectedContainer>
  );
};

// Reusable Info Card Component
export const InfoCard: React.FC<InfoCardProps> = ({ 
  title, 
  subtitle, 
  children, 
  variant = 'default' 
}) => (
  <Card>
    <Title>{title}</Title>
    {subtitle && <Subtitle>{subtitle}</Subtitle>}
    {children}
  </Card>
);

// Reusable Data Card Component  
export const DataCard: React.FC<DataCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  variant = 'default' 
}) => (
  <Card style={{ alignItems: 'center', minHeight: 120, justifyContent: 'center' }}>
    <Row gap="sm" style={{ alignItems: 'center', marginBottom: 8 }}>
      {icon && <StatusText style={{ fontSize: 24 }}>{icon}</StatusText>}
      <Title size="md">{title}</Title>
    </Row>
    <Title size="xxl" style={{ color: variant === 'success' ? '#28a745' : variant === 'error' ? '#dc3545' : '#212529' }}>
      {value}
    </Title>
    {subtitle && <Subtitle size="sm">{subtitle}</Subtitle>}
  </Card>
);

// Reusable Section Header Component
export const SectionHeader: React.FC<{ 
  title: string; 
  subtitle?: string;
  action?: React.ReactNode;
}> = ({ title, subtitle, action }) => (
  <Row gap="md" style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
    <Column gap="xs" style={{ flex: 1 }}>
      <Title size="xl" style={{ textAlign: 'left', marginBottom: 0 }}>{title}</Title>
      {subtitle && <Subtitle size="md" style={{ textAlign: 'left' }}>{subtitle}</Subtitle>}
    </Column>
    {action}
  </Row>
);

// Reusable Empty State Component
export const EmptyState: React.FC<{
  icon?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}> = ({ icon = '📭', title, subtitle, action }) => (
  <Card style={{ alignItems: 'center', padding: 40, minHeight: 200, justifyContent: 'center' }}>
    <StatusText style={{ fontSize: 48, marginBottom: 16 }}>{icon}</StatusText>
    <Title size="lg">{title}</Title>
    {subtitle && <Subtitle style={{ marginBottom: 20, textAlign: 'center' }}>{subtitle}</Subtitle>}
    {action}
  </Card>
);

// Reusable Loading State Component  
export const LoadingState: React.FC<{
  title?: string;
  subtitle?: string;
}> = ({ title = 'Loading...', subtitle }) => (
  <Card style={{ alignItems: 'center', padding: 40, minHeight: 200, justifyContent: 'center' }}>
    <StatusIndicator variant="warning" style={{ width: 20, height: 20, marginBottom: 16 }} />
    <Title size="lg">{title}</Title>
    {subtitle && <Subtitle style={{ textAlign: 'center' }}>{subtitle}</Subtitle>}
  </Card>
);
