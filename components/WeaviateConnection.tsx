import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
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
      <View style={styles.container}>
        <View style={styles.connectedContainer}>
          <View style={styles.statusRow}>
            <View style={styles.statusIndicator} />
            <View style={styles.statusInfo}>
              <Text style={styles.statusText}>Connected to Weaviate</Text>
              <Text style={styles.statusDetails}>
                {config.scheme}://{config.host}
              </Text>
            </View>
            <TouchableOpacity style={styles.disconnectButton} onPress={handleDisconnect}>
              <Text style={styles.disconnectButtonText}>Disconnect</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Connect to Weaviate</Text>
        <Text style={styles.subtitle}>Enter your Weaviate instance details to get started</Text>
      </View>
      
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Protocol</Text>
          <View style={styles.schemeContainer}>
            <TouchableOpacity
              style={[styles.schemeButton, config.scheme === 'https' && styles.schemeButtonActive]}
              onPress={() => setConfig({ ...config, scheme: 'https' })}
            >
              <Text style={[styles.schemeButtonText, config.scheme === 'https' && styles.schemeButtonTextActive]}>
                🔒 HTTPS
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.schemeButton, config.scheme === 'http' && styles.schemeButtonActive]}
              onPress={() => setConfig({ ...config, scheme: 'http' })}
            >
              <Text style={[styles.schemeButtonText, config.scheme === 'http' && styles.schemeButtonTextActive]}>
                🔓 HTTP
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Host Address</Text>
          <TextInput
            style={styles.input}
            value={config.host}
            onChangeText={(text) => setConfig({ ...config, host: text })}
            placeholder="localhost:8080 or your-cluster.weaviate.network"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text style={styles.inputHint}>
            Examples: localhost:8080, weaviate.example.com, your-cluster.weaviate.network
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>API Key (Optional)</Text>
          <TextInput
            style={styles.input}
            value={config.apiKey}
            onChangeText={(text) => setConfig({ ...config, apiKey: text })}
            placeholder="Enter your API key if required"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text style={styles.inputHint}>
            Required for Weaviate Cloud Service and secured instances
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.connectButton, isConnecting && styles.connectButtonDisabled]}
          onPress={handleConnect}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#ffffff" size="small" />
              <Text style={styles.connectButtonText}>Connecting...</Text>
            </View>
          ) : (
            <Text style={styles.connectButtonText}>🚀 Connect to Weaviate</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#212529',
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    gap: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#495057',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 4,
  },
  inputHint: {
    fontSize: 12,
    color: '#6c757d',
    fontStyle: 'italic',
    lineHeight: 16,
  },
  schemeContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  schemeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  schemeButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  schemeButtonText: {
    fontSize: 16,
    color: '#333',
  },
  schemeButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  connectButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  connectButtonDisabled: {
    backgroundColor: '#adb5bd',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  connectedContainer: {
    backgroundColor: '#d1edff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#28a745',
    marginRight: 12,
  },
  statusInfo: {
    flex: 1,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 2,
  },
  statusDetails: {
    fontSize: 14,
    color: '#6c757d',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
  },
  disconnectButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  disconnectButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
