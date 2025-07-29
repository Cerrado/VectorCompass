// Flutter theme system - migrated from React Native styled-components theme
import 'package:flutter/material.dart';

class AppColors {
  static const Color primary = Color(0xFF007AFF);
  static const Color secondary = Color(0xFF8E8E93);
  static const Color destructive = Color(0xFFFF3B30);
  static const Color success = Color(0xFF28A745);
  static const Color background = Color(0xFFFFFFFF);
  static const Color surface = Color(0xFFF8F9FA);
  static const Color overlay = Color(0x80000000); // rgba(0, 0, 0, 0.5)
  static const Color border = Color(0xFFCED4DA);
  static const Color shade = Color(0xFFD1EDFF);
  
  // Text colors
  static const Color textPrimary = Color(0xFF212529);
  static const Color textSecondary = Color(0xFF6C757D);
  static const Color textWhite = Color(0xFFFFFFFF);
}

class AppSpacing {
  static const double xs = 4.0;
  static const double sm = 8.0;
  static const double md = 12.0;
  static const double lg = 16.0;
  static const double xl = 20.0;
  static const double xxl = 24.0;
}

class AppBorderRadius {
  static const double sm = 6.0;
  static const double md = 8.0;
  static const double lg = 12.0;
}

class AppFontSizes {
  static const double sm = 12.0;
  static const double md = 14.0;
  static const double lg = 16.0;
  static const double xl = 18.0;
  static const double xxl = 24.0;
}

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.primary,
        brightness: Brightness.light,
        primary: AppColors.primary,
        secondary: AppColors.secondary,
        error: AppColors.destructive,
        surface: AppColors.surface,
        background: AppColors.background,
      ),
      
      // App Bar Theme
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.surface,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: TextStyle(
          fontSize: AppFontSizes.xl,
          fontWeight: FontWeight.bold,
          color: AppColors.textPrimary,
        ),
      ),
      
      // Text Theme
      textTheme: const TextTheme(
        displayLarge: TextStyle(
          fontSize: AppFontSizes.xxl,
          fontWeight: FontWeight.bold,
          color: AppColors.textPrimary,
        ),
        displayMedium: TextStyle(
          fontSize: AppFontSizes.xl,
          fontWeight: FontWeight.w600,
          color: AppColors.textPrimary,
        ),
        bodyLarge: TextStyle(
          fontSize: AppFontSizes.lg,
          color: AppColors.textPrimary,
        ),
        bodyMedium: TextStyle(
          fontSize: AppFontSizes.md,
          color: AppColors.textSecondary,
        ),
        bodySmall: TextStyle(
          fontSize: AppFontSizes.sm,
          color: AppColors.textSecondary,
        ),
      ),
      
      // Input Decoration Theme
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.background,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppBorderRadius.md),
          borderSide: const BorderSide(color: AppColors.border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppBorderRadius.md),
          borderSide: const BorderSide(color: AppColors.border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppBorderRadius.md),
          borderSide: const BorderSide(color: AppColors.primary, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppBorderRadius.md),
          borderSide: const BorderSide(color: AppColors.destructive),
        ),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.lg,
          vertical: AppSpacing.md,
        ),
      ),
      
      // Elevated Button Theme
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: AppColors.textWhite,
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.xl,
            vertical: AppSpacing.md,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppBorderRadius.md),
          ),
          textStyle: const TextStyle(
            fontSize: AppFontSizes.lg,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      
      // Card Theme
      cardTheme: CardThemeData(
        color: AppColors.background,
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppBorderRadius.lg),
        ),
        margin: const EdgeInsets.all(AppSpacing.sm),
      ),


      // Divider Theme
      dividerTheme: const DividerThemeData(
        color: AppColors.border,
        thickness: 1,
      ),
    );
  }
}

// Custom button styles for different variants
class AppButtonStyles {
  static ButtonStyle primaryStyle = ElevatedButton.styleFrom(
    backgroundColor: AppColors.primary,
    foregroundColor: AppColors.textWhite,
  );
  
  static ButtonStyle secondaryStyle = ElevatedButton.styleFrom(
    backgroundColor: AppColors.secondary,
    foregroundColor: AppColors.textWhite,
  );
  
  static ButtonStyle destructiveStyle = ElevatedButton.styleFrom(
    backgroundColor: AppColors.destructive,
    foregroundColor: AppColors.textWhite,
  );
  
  static ButtonStyle successStyle = ElevatedButton.styleFrom(
    backgroundColor: AppColors.success,
    foregroundColor: AppColors.textWhite,
  );
}

// Custom text styles
class AppTextStyles {
  static const TextStyle title = TextStyle(
    fontSize: AppFontSizes.xxl,
    fontWeight: FontWeight.bold,
    color: AppColors.textPrimary,
  );
  
  static const TextStyle subtitle = TextStyle(
    fontSize: AppFontSizes.lg,
    color: AppColors.textSecondary,
  );
  
  static const TextStyle body = TextStyle(
    fontSize: AppFontSizes.md,
    color: AppColors.textPrimary,
  );
  
  static const TextStyle caption = TextStyle(
    fontSize: AppFontSizes.sm,
    color: AppColors.textSecondary,
  );
}