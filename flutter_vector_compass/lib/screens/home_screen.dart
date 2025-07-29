// Home screen - migrated from React Native app/index.tsx
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../theme/app_theme.dart';
import '../services/weaviate_service.dart';
import '../widgets/weaviate_connection.dart';
import '../widgets/collection_viewer.dart';

/// Main home screen that manages connection state and displays main components
/// Migrated from: app/index.tsx
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool _isConnected = false;

  /// Handle successful connection to Weaviate
  /// Migrated from: handleConnected function in index.tsx
  void _handleConnected() {
    setState(() {
      _isConnected = true;
    });
  }

  /// Handle disconnection from Weaviate
  void _handleDisconnected() {
    setState(() {
      _isConnected = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // App bar configuration (replaces Stack.Screen options in _layout.tsx)
      appBar: AppBar(
        title: const Text('Vector Compass'),
        backgroundColor: AppColors.surface,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
        centerTitle: true,
      ),
      
      // Main content (replaces SafeAreaView and ScrollView)
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.lg,
            vertical: AppSpacing.xxl,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Weaviate connection component
              // Migrated from: <WeaviateConnection onConnected={handleConnected} />
              WeaviateConnectionWidget(
                onConnected: _handleConnected,
                onDisconnected: _handleDisconnected,
              ),
              
              // Collection viewer (only shown when connected)
              // Migrated from: {isConnected && <CollectionViewer />}
              if (_isConnected) ...[
                const SizedBox(height: AppSpacing.xxl),
                const CollectionViewerWidget(),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

/// Connection status indicator widget
class ConnectionStatusIndicator extends StatelessWidget {
  final bool isConnected;
  final String? connectionUrl;

  const ConnectionStatusIndicator({
    super.key,
    required this.isConnected,
    this.connectionUrl,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: isConnected ? AppColors.success : AppColors.destructive,
        borderRadius: BorderRadius.circular(AppBorderRadius.md),
      ),
      child: Row(
        children: [
          Icon(
            isConnected ? Icons.check_circle : Icons.error,
            color: AppColors.textWhite,
            size: 20,
          ),
          const SizedBox(width: AppSpacing.sm),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  isConnected ? 'Connected' : 'Disconnected',
                  style: const TextStyle(
                    color: AppColors.textWhite,
                    fontWeight: FontWeight.w600,
                    fontSize: AppFontSizes.md,
                  ),
                ),
                if (connectionUrl != null && isConnected)
                  Text(
                    connectionUrl!,
                    style: const TextStyle(
                      color: AppColors.textWhite,
                      fontSize: AppFontSizes.sm,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// Loading overlay widget for async operations
class LoadingOverlay extends StatelessWidget {
  final bool isVisible;
  final String? message;

  const LoadingOverlay({
    super.key,
    required this.isVisible,
    this.message,
  });

  @override
  Widget build(BuildContext context) {
    if (!isVisible) return const SizedBox.shrink();

    return Container(
      color: AppColors.overlay,
      child: Center(
        child: Card(
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.xl),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const CircularProgressIndicator(
                  valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary),
                ),
                if (message != null) ...[
                  const SizedBox(height: AppSpacing.lg),
                  Text(
                    message!,
                    style: AppTextStyles.body,
                    textAlign: TextAlign.center,
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// Error display widget
class ErrorDisplay extends StatelessWidget {
  final String title;
  final String message;
  final VoidCallback? onRetry;

  const ErrorDisplay({
    super.key,
    required this.title,
    required this.message,
    this.onRetry,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: AppColors.destructive.withOpacity(0.1),
        borderRadius: BorderRadius.circular(AppBorderRadius.md),
        border: Border.all(color: AppColors.destructive.withOpacity(0.3)),
      ),
      child: Column(
        children: [
          const Icon(
            Icons.error_outline,
            color: AppColors.destructive,
            size: 48,
          ),
          const SizedBox(height: AppSpacing.md),
          Text(
            title,
            style: const TextStyle(
              color: AppColors.destructive,
              fontSize: AppFontSizes.lg,
              fontWeight: FontWeight.w600,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(
            message,
            style: AppTextStyles.body,
            textAlign: TextAlign.center,
          ),
          if (onRetry != null) ...[
            const SizedBox(height: AppSpacing.lg),
            ElevatedButton(
              onPressed: onRetry,
              style: AppButtonStyles.primaryStyle,
              child: const Text('Retry'),
            ),
          ],
        ],
      ),
    );
  }
}