// Main Flutter app entry point - migrated from React Native Expo app
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';

import 'theme/app_theme.dart';
import 'screens/home_screen.dart';
import 'services/weaviate_service.dart';

void main() {
  runApp(const VectorCompassApp());
}

class VectorCompassApp extends StatelessWidget {
  const VectorCompassApp({super.key});

  @override
  Widget build(BuildContext context) {
    // Configure system UI overlay style (replaces expo-status-bar)
    SystemChrome.setSystemUIOverlayStyle(
      const SystemUiOverlayStyle(
        statusBarColor: AppColors.primary,
        statusBarIconBrightness: Brightness.light,
        statusBarBrightness: Brightness.dark,
      ),
    );

    return MultiProvider(
      providers: [
        // Provide WeaviateService globally (replaces React context/hooks)
        Provider<WeaviateService>.value(value: weaviateService),
      ],
      child: MaterialApp.router(
        title: 'Vector Compass',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        routerConfig: _router,
      ),
    );
  }
}

// Router configuration (replaces expo-router)
final GoRouter _router = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      name: 'home',
      builder: (context, state) => const HomeScreen(),
    ),
  ],
  errorBuilder: (context, state) => Scaffold(
    appBar: AppBar(
      title: const Text('Error'),
    ),
    body: Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(
            Icons.error_outline,
            size: 64,
            color: AppColors.destructive,
          ),
          const SizedBox(height: AppSpacing.lg),
          Text(
            'Page not found',
            style: AppTextStyles.title,
          ),
          const SizedBox(height: AppSpacing.md),
          Text(
            'The requested page could not be found.',
            style: AppTextStyles.body,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: AppSpacing.xl),
          ElevatedButton(
            onPressed: () => context.go('/'),
            child: const Text('Go Home'),
          ),
        ],
      ),
    ),
  ),
);