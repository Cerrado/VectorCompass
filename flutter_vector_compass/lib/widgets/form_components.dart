// Form components - migrated from React Native components/forms/Form.tsx
import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';

import '../theme/app_theme.dart';

/// Form field widget for text input
/// Migrated from: FormField component in Form.tsx
class FormFieldWidget extends StatelessWidget {
  final String label;
  final TextEditingController controller;
  final String? placeholder;
  final String? hint;
  final bool obscureText;
  final TextInputType keyboardType;
  final TextCapitalization textCapitalization;
  final bool autocorrect;
  final bool hasError;
  final String? Function(String?)? validator;
  final void Function(String)? onChanged;

  const FormFieldWidget({
    super.key,
    required this.label,
    required this.controller,
    this.placeholder,
    this.hint,
    this.obscureText = false,
    this.keyboardType = TextInputType.text,
    this.textCapitalization = TextCapitalization.none,
    this.autocorrect = false,
    this.hasError = false,
    this.validator,
    this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Label
        Text(
          label,
          style: const TextStyle(
            fontSize: AppFontSizes.md,
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: AppSpacing.sm),
        
        // Text field
        TextFormField(
          controller: controller,
          obscureText: obscureText,
          keyboardType: keyboardType,
          textCapitalization: textCapitalization,
          autocorrect: autocorrect,
          validator: validator,
          onChanged: onChanged,
          decoration: InputDecoration(
            hintText: placeholder,
            errorBorder: hasError
                ? OutlineInputBorder(
                    borderRadius: BorderRadius.circular(AppBorderRadius.md),
                    borderSide: const BorderSide(color: AppColors.destructive),
                  )
                : null,
          ),
        ),
        
        // Hint text
        if (hint != null) ...[
          const SizedBox(height: AppSpacing.xs),
          Text(
            hint!,
            style: const TextStyle(
              fontSize: AppFontSizes.sm,
              color: AppColors.textSecondary,
            ),
          ),
        ],
      ],
    );
  }
}

/// Toggle option data class
class ToggleOption {
  final String label;
  final String value;
  final String? icon;

  const ToggleOption({
    required this.label,
    required this.value,
    this.icon,
  });
}

/// Toggle field widget for selecting between options
/// Migrated from: ToggleField component in Form.tsx
class ToggleFieldWidget extends StatelessWidget {
  final String label;
  final List<ToggleOption> options;
  final String selectedValue;
  final void Function(String) onValueChange;

  const ToggleFieldWidget({
    super.key,
    required this.label,
    required this.options,
    required this.selectedValue,
    required this.onValueChange,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Label
        Text(
          label,
          style: const TextStyle(
            fontSize: AppFontSizes.md,
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: AppSpacing.sm),
        
        // Toggle buttons
        Container(
          decoration: BoxDecoration(
            border: Border.all(color: AppColors.border),
            borderRadius: BorderRadius.circular(AppBorderRadius.md),
          ),
          child: Row(
            children: options.map((option) {
              final isSelected = selectedValue == option.value;
              final isFirst = options.first == option;
              final isLast = options.last == option;
              
              return Expanded(
                child: GestureDetector(
                  onTap: () => onValueChange(option.value),
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.lg,
                      vertical: AppSpacing.md,
                    ),
                    decoration: BoxDecoration(
                      color: isSelected ? AppColors.primary : Colors.transparent,
                      borderRadius: BorderRadius.only(
                        topLeft: isFirst ? const Radius.circular(AppBorderRadius.md - 1) : Radius.zero,
                        bottomLeft: isFirst ? const Radius.circular(AppBorderRadius.md - 1) : Radius.zero,
                        topRight: isLast ? const Radius.circular(AppBorderRadius.md - 1) : Radius.zero,
                        bottomRight: isLast ? const Radius.circular(AppBorderRadius.md - 1) : Radius.zero,
                      ),
                    ),
                    child: Text(
                      '${option.icon ?? ''} ${option.label}',
                      style: TextStyle(
                        fontSize: AppFontSizes.md,
                        fontWeight: FontWeight.w500,
                        color: isSelected ? AppColors.textWhite : AppColors.textPrimary,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }
}

/// Submit button widget with loading state
/// Migrated from: SubmitButton component in Form.tsx
class SubmitButtonWidget extends StatelessWidget {
  final String title;
  final VoidCallback? onPressed;
  final bool isLoading;
  final String loadingText;
  final ButtonVariant variant;
  final ButtonSize size;
  final String? icon;

  const SubmitButtonWidget({
    super.key,
    required this.title,
    this.onPressed,
    this.isLoading = false,
    this.loadingText = 'Loading...',
    this.variant = ButtonVariant.primary,
    this.size = ButtonSize.large,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: isLoading ? null : onPressed,
      style: _getButtonStyle(),
      child: isLoading
          ? Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                SpinKitThreeBounce(
                  color: AppColors.textWhite,
                  size: _getLoadingSize(),
                ),
                const SizedBox(width: AppSpacing.sm),
                Text(
                  loadingText,
                  style: TextStyle(
                    fontSize: _getFontSize(),
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            )
          : Text(
              '${icon ?? ''} $title',
              style: TextStyle(
                fontSize: _getFontSize(),
                fontWeight: FontWeight.w600,
              ),
            ),
    );
  }

  ButtonStyle _getButtonStyle() {
    ButtonStyle baseStyle;
    
    switch (variant) {
      case ButtonVariant.primary:
        baseStyle = AppButtonStyles.primaryStyle;
        break;
      case ButtonVariant.secondary:
        baseStyle = AppButtonStyles.secondaryStyle;
        break;
      case ButtonVariant.destructive:
        baseStyle = AppButtonStyles.destructiveStyle;
        break;
      case ButtonVariant.success:
        baseStyle = AppButtonStyles.successStyle;
        break;
    }

    return baseStyle.copyWith(
      padding: MaterialStateProperty.all(
        EdgeInsets.symmetric(
          horizontal: _getHorizontalPadding(),
          vertical: _getVerticalPadding(),
        ),
      ),
    );
  }

  double _getFontSize() {
    switch (size) {
      case ButtonSize.small:
        return AppFontSizes.sm;
      case ButtonSize.medium:
        return AppFontSizes.md;
      case ButtonSize.large:
        return AppFontSizes.lg;
    }
  }

  double _getHorizontalPadding() {
    switch (size) {
      case ButtonSize.small:
        return AppSpacing.md;
      case ButtonSize.medium:
        return AppSpacing.lg;
      case ButtonSize.large:
        return AppSpacing.xl;
    }
  }

  double _getVerticalPadding() {
    switch (size) {
      case ButtonSize.small:
        return AppSpacing.sm;
      case ButtonSize.medium:
        return AppSpacing.md;
      case ButtonSize.large:
        return AppSpacing.md;
    }
  }

  double _getLoadingSize() {
    switch (size) {
      case ButtonSize.small:
        return 12.0;
      case ButtonSize.medium:
        return 16.0;
      case ButtonSize.large:
        return 20.0;
    }
  }
}

/// Button variant enum
enum ButtonVariant {
  primary,
  secondary,
  destructive,
  success,
}

/// Button size enum
enum ButtonSize {
  small,
  medium,
  large,
}

/// Custom form wrapper widget
/// Migrated from: Form component in Form.tsx
class FormWrapper extends StatelessWidget {
  final Widget child;
  final EdgeInsets? padding;

  const FormWrapper({
    super.key,
    required this.child,
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: padding ?? const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.circular(AppBorderRadius.lg),
        border: Border.all(color: AppColors.border.withOpacity(0.3)),
      ),
      child: child,
    );
  }
}

/// Loading state widget for forms
class FormLoadingState extends StatelessWidget {
  final String? message;

  const FormLoadingState({
    super.key,
    this.message,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const SpinKitFadingCircle(
            color: AppColors.primary,
            size: 50.0,
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
    );
  }
}