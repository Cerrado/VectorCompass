// Weaviate connection widget - migrated from React Native WeaviateConnection.tsx
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:rflutter_alert/rflutter_alert.dart';

import '../theme/app_theme.dart';
import '../models/weaviate_models.dart';
import '../services/weaviate_service.dart';
import '../screens/home_screen.dart';
import 'form_components.dart';

/// Widget for connecting to Weaviate instances
/// Migrated from: components/weaviate/WeaviateConnection.tsx
class WeaviateConnectionWidget extends StatefulWidget {
  final VoidCallback onConnected;
  final VoidCallback onDisconnected;

  const WeaviateConnectionWidget({
    super.key,
    required this.onConnected,
    required this.onDisconnected,
  });

  @override
  State<WeaviateConnectionWidget> createState() => _WeaviateConnectionWidgetState();
}

class _WeaviateConnectionWidgetState extends State<WeaviateConnectionWidget> {
  final _formKey = GlobalKey<FormState>();
  final _hostController = TextEditingController(text: 'localhost:8080');
  final _apiKeyController = TextEditingController();
  
  String _scheme = 'https';
  bool _isConnecting = false;
  bool _isConnected = false;

  @override
  void initState() {
    super.initState();
    _checkConnectionStatus();
  }

  @override
  void dispose() {
    _hostController.dispose();
    _apiKeyController.dispose();
    super.dispose();
  }

  /// Check if already connected to Weaviate
  void _checkConnectionStatus() {
    final weaviateService = context.read<WeaviateService>();
    setState(() {
      _isConnected = weaviateService.isConnected;
    });
  }

  /// Handle connection to Weaviate
  /// Migrated from: handleConnect function in WeaviateConnection.tsx
  Future<void> _handleConnect() async {
    if (!_formKey.currentState!.validate()) return;

    final host = _hostController.text.trim();
    if (host.isEmpty) {
      _showAlert('Error', 'Please enter a host');
      return;
    }

    setState(() {
      _isConnecting = true;
    });

    try {
      final config = WeaviateConfig(
        scheme: _scheme,
        host: host,
        apiKey: _apiKeyController.text.trim().isEmpty 
            ? null 
            : _apiKeyController.text.trim(),
      );

      final weaviateService = context.read<WeaviateService>();
      final connected = await weaviateService.connect(config);

      if (connected) {
        setState(() {
          _isConnected = true;
        });
        _showAlert('Success', 'Connected to Weaviate successfully!');
        widget.onConnected();
      } else {
        _showAlert('Error', 'Failed to connect to Weaviate');
      }
    } catch (error) {
      _showAlert('Error', 'Connection failed: $error');
    } finally {
      setState(() {
        _isConnecting = false;
      });
    }
  }

  /// Handle disconnection from Weaviate
  /// Migrated from: handleDisconnect function in WeaviateConnection.tsx
  void _handleDisconnect() {
    final weaviateService = context.read<WeaviateService>();
    weaviateService.disconnect();
    setState(() {
      _isConnected = false;
    });
    widget.onDisconnected();
  }

  /// Show alert dialog
  /// Migrated from: Alert.alert calls in WeaviateConnection.tsx
  void _showAlert(String title, String message) {
    Alert(
      context: context,
      type: title == 'Success' ? AlertType.success : AlertType.error,
      title: title,
      desc: message,
      buttons: [
        DialogButton(
          onPressed: () => Navigator.pop(context),
          child: const Text(
            'OK',
            style: TextStyle(color: Colors.white, fontSize: 20),
          ),
        ),
      ],
    ).show();
  }

  @override
  Widget build(BuildContext context) {
    final weaviateService = context.watch<WeaviateService>();

    // Show connected state
    if (_isConnected && weaviateService.isConnected) {
      return _buildConnectedState(weaviateService);
    }

    // Show connection form
    return _buildConnectionForm();
  }

  /// Build the connected state UI
  Widget _buildConnectedState(WeaviateService weaviateService) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          children: [
            ConnectionStatusIndicator(
              isConnected: true,
              connectionUrl: weaviateService.baseUrl,
            ),
            const SizedBox(height: AppSpacing.lg),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _handleDisconnect,
                style: AppButtonStyles.destructiveStyle,
                child: const Text('Disconnect'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// Build the connection form UI
  /// Migrated from: connection form JSX in WeaviateConnection.tsx
  Widget _buildConnectionForm() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Text(
                'Connect to Weaviate',
                style: AppTextStyles.title,
              ),
              const SizedBox(height: AppSpacing.sm),
              Text(
                'Enter your Weaviate instance details to get started',
                style: AppTextStyles.subtitle,
              ),
              const SizedBox(height: AppSpacing.xxl),

              // Protocol toggle
              // Migrated from: ToggleField component
              ToggleFieldWidget(
                label: 'Protocol',
                options: const [
                  ToggleOption(label: 'HTTPS', value: 'https', icon: '🔒'),
                  ToggleOption(label: 'HTTP', value: 'http', icon: '🔓'),
                ],
                selectedValue: _scheme,
                onValueChange: (value) {
                  setState(() {
                    _scheme = value;
                  });
                },
              ),
              const SizedBox(height: AppSpacing.lg),

              // Host field
              // Migrated from: FormField component
              FormFieldWidget(
                label: 'Host Address',
                controller: _hostController,
                placeholder: 'localhost:8080 or your-cluster.weaviate.network',
                hint: 'Examples: localhost:8080, weaviate.example.com, your-cluster.weaviate.network',
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Please enter a host address';
                  }
                  return null;
                },
              ),
              const SizedBox(height: AppSpacing.lg),

              // API Key field
              // Migrated from: FormField component with secureTextEntry
              FormFieldWidget(
                label: 'API Key (Optional)',
                controller: _apiKeyController,
                placeholder: 'Enter your API key if required',
                hint: 'Required for Weaviate Cloud Service and secured instances',
                obscureText: true,
              ),
              const SizedBox(height: AppSpacing.xxl),

              // Submit button
              // Migrated from: SubmitButton component
              SizedBox(
                width: double.infinity,
                child: SubmitButtonWidget(
                  title: 'Connect to Weaviate',
                  onPressed: _handleConnect,
                  isLoading: _isConnecting,
                  loadingText: 'Connecting...',
                  icon: '🚀',
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}