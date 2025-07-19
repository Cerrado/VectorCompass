import React, { useState } from 'react';
import { Alert } from 'react-native';
import { 
  Container, 
  Title, 
  Subtitle, 
  HeaderContainer
} from '../styles/components';
import { Form, FormField, ToggleField, SubmitButton } from './Form';
import { ConnectionStatus } from './UIComponents';
import { weaviateHttpService, WeaviateConfig } from './WeaviateHttpClient';

interface WeaviateConnectionProps {
  onConnected: () => void;
}

export default function WeaviateConnection({ onConnected }: WeaviateConnectionProps) {
  const [config, setConfig] = useState<WeaviateConfig>({
    scheme: 'https',
    host: 'localhost:8080',
    apiKey: '',
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = async () => {
    if (!config.host.trim()) {
      Alert.alert('Error', 'Please enter a host');
      return;
    }

    setIsConnecting(true);
    try {
      const connected = await weaviateHttpService.connect(config);
      if (connected) {
        setIsConnected(true);
        Alert.alert('Success', 'Connected to Weaviate successfully!');
        onConnected();
      } else {
        Alert.alert('Error', 'Failed to connect to Weaviate');
      }
    } catch (error) {
      Alert.alert('Error', `Connection failed: ${error}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    weaviateHttpService.disconnect();
    setIsConnected(false);
  };

  if (isConnected) {
    return (
      <Container>
        <ConnectionStatus
          isConnected={isConnected}
          title="Connected to Weaviate"
          subtitle={`${config.scheme}://${config.host}`}
          onDisconnect={handleDisconnect}
        />
      </Container>
    );
  }

  return (
    <Container>
      <HeaderContainer>
        <Title>Connect to Weaviate</Title>
        <Subtitle>Enter your Weaviate instance details to get started</Subtitle>
      </HeaderContainer>
      
      <Form>
        <ToggleField
          label="Protocol"
          options={[
            { label: 'HTTPS', value: 'https', icon: '🔒' },
            { label: 'HTTP', value: 'http', icon: '🔓' }
          ]}
          selectedValue={config.scheme}
          onValueChange={(value) => setConfig({ ...config, scheme: value as 'http' | 'https' })}
        />

        <FormField
          label="Host Address"
          value={config.host}
          onChangeText={(text) => setConfig({ ...config, host: text })}
          placeholder="localhost:8080 or your-cluster.weaviate.network"
          hint="Examples: localhost:8080, weaviate.example.com, your-cluster.weaviate.network"
        />

        <FormField
          label="API Key (Optional)"
          value={config.apiKey || ''}
          onChangeText={(text) => setConfig({ ...config, apiKey: text })}
          placeholder="Enter your API key if required"
          hint="Required for Weaviate Cloud Service and secured instances"
          secureTextEntry
        />

        <SubmitButton
          title="Connect to Weaviate"
          onPress={handleConnect}
          disabled={isConnecting}
          loading={isConnecting}
          loadingText="Connecting..."
          icon="🚀"
        />
      </Form>
    </Container>
  );
}
