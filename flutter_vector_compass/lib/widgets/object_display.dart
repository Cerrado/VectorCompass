// Object display widget - migrated from React Native ObjectDisplay, ObjectTable, ObjectCard
import 'package:flutter/material.dart';

import '../theme/app_theme.dart';
import '../models/weaviate_models.dart';
import 'collection_viewer.dart';

/// Widget for displaying Weaviate objects in table or card format
/// Migrated from: components/objects/ObjectDisplay.tsx, ObjectTable.tsx, ObjectCard.tsx
class ObjectDisplayWidget extends StatelessWidget {
  final List<WeaviateObject> objects;
  final String collectionName;
  final ViewMode viewMode;
  final bool refreshing;
  final void Function(WeaviateObject) onObjectPress;
  final VoidCallback onRefresh;

  const ObjectDisplayWidget({
    super.key,
    required this.objects,
    required this.collectionName,
    required this.viewMode,
    required this.refreshing,
    required this.onObjectPress,
    required this.onRefresh,
  });

  @override
  Widget build(BuildContext context) {
    if (objects.isEmpty) {
      return _buildEmptyState();
    }

    return Column(
      children: [
        if (refreshing)
          const LinearProgressIndicator(
            backgroundColor: AppColors.surface,
            valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary),
          ),
        const SizedBox(height: AppSpacing.md),
        viewMode == ViewMode.table
            ? _buildTableView()
            : _buildCardView(),
      ],
    );
  }

  /// Build empty state when no objects are available
  Widget _buildEmptyState() {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.xl),
      child: Column(
        children: [
          const Icon(
            Icons.inbox_outlined,
            size: 64,
            color: AppColors.secondary,
          ),
          const SizedBox(height: AppSpacing.lg),
          Text(
            'No Objects Found',
            style: AppTextStyles.title.copyWith(
              color: AppColors.secondary,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(
            collectionName.isEmpty
                ? 'Load a collection to view its objects'
                : 'Collection "$collectionName" is empty',
            style: AppTextStyles.body,
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  /// Build table view for objects
  /// Migrated from: ObjectTable.tsx
  Widget _buildTableView() {
    // Get all unique property keys from objects
    final Set<String> allKeys = <String>{};
    for (final object in objects) {
      allKeys.addAll(object.properties.keys);
    }
    final List<String> propertyKeys = allKeys.toList()..sort();

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Container(
        decoration: BoxDecoration(
          border: Border.all(color: AppColors.border),
          borderRadius: BorderRadius.circular(AppBorderRadius.md),
        ),
        child: DataTable(
          headingRowColor: MaterialStateProperty.all(AppColors.surface),
          columns: [
            const DataColumn(
              label: Text(
                'ID',
                style: TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: AppFontSizes.sm,
                ),
              ),
            ),
            ...propertyKeys.map((key) => DataColumn(
              label: Text(
                key,
                style: const TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: AppFontSizes.sm,
                ),
              ),
            )),
            const DataColumn(
              label: Text(
                'Vector Dim',
                style: TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: AppFontSizes.sm,
                ),
              ),
            ),
            const DataColumn(
              label: Text(
                'Created',
                style: TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: AppFontSizes.sm,
                ),
              ),
            ),
          ],
          rows: objects.map((object) {
            return DataRow(
              onSelectChanged: (_) => onObjectPress(object),
              cells: [
                DataCell(
                  Container(
                    constraints: const BoxConstraints(maxWidth: 120),
                    child: Text(
                      object.id,
                      style: const TextStyle(
                        fontSize: AppFontSizes.sm,
                        fontFamily: 'monospace',
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ),
                ...propertyKeys.map((key) {
                  final value = object.properties[key];
                  return DataCell(
                    Container(
                      constraints: const BoxConstraints(maxWidth: 150),
                      child: Text(
                        _formatPropertyValue(value),
                        style: const TextStyle(fontSize: AppFontSizes.sm),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  );
                }),
                DataCell(
                  Text(
                    object.vectorDimension?.toString() ?? 'N/A',
                    style: const TextStyle(fontSize: AppFontSizes.sm),
                  ),
                ),
                DataCell(
                  Text(
                    object.formattedCreationTime,
                    style: const TextStyle(fontSize: AppFontSizes.sm),
                  ),
                ),
              ],
            );
          }).toList(),
        ),
      ),
    );
  }

  /// Build card view for objects
  /// Migrated from: ObjectCard.tsx
  Widget _buildCardView() {
    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: objects.length,
      itemBuilder: (context, index) {
        final object = objects[index];
        return _buildObjectCard(object);
      },
    );
  }

  /// Build individual object card
  Widget _buildObjectCard(WeaviateObject object) {
    return Card(
      margin: const EdgeInsets.only(bottom: AppSpacing.md),
      child: InkWell(
        onTap: () => onObjectPress(object),
        borderRadius: BorderRadius.circular(AppBorderRadius.lg),
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header with ID and class
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'ID: ${object.id}',
                          style: const TextStyle(
                            fontSize: AppFontSizes.sm,
                            fontFamily: 'monospace',
                            color: AppColors.textSecondary,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: AppSpacing.xs),
                        Text(
                          'Class: ${object.className}',
                          style: const TextStyle(
                            fontSize: AppFontSizes.md,
                            fontWeight: FontWeight.w600,
                            color: AppColors.primary,
                          ),
                        ),
                      ],
                    ),
                  ),
                  // Metadata badges
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      _buildBadge('${object.propertyCount} props', AppColors.secondary),
                      const SizedBox(height: AppSpacing.xs),
                      if (object.vectorDimension != null)
                        _buildBadge('${object.vectorDimension}D vector', AppColors.success),
                    ],
                  ),
                ],
              ),
              
              const SizedBox(height: AppSpacing.md),
              const Divider(),
              const SizedBox(height: AppSpacing.md),
              
              // Properties
              Text(
                'Properties',
                style: const TextStyle(
                  fontSize: AppFontSizes.md,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: AppSpacing.sm),
              
              ...object.properties.entries.take(5).map((entry) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: AppSpacing.xs),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SizedBox(
                        width: 100,
                        child: Text(
                          '${entry.key}:',
                          style: const TextStyle(
                            fontSize: AppFontSizes.sm,
                            fontWeight: FontWeight.w500,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ),
                      Expanded(
                        child: Text(
                          _formatPropertyValue(entry.value),
                          style: const TextStyle(
                            fontSize: AppFontSizes.sm,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                );
              }),
              
              // Show more indicator if there are more properties
              if (object.properties.length > 5) ...[
                const SizedBox(height: AppSpacing.xs),
                Text(
                  '... and ${object.properties.length - 5} more properties',
                  style: const TextStyle(
                    fontSize: AppFontSizes.sm,
                    color: AppColors.textSecondary,
                    fontStyle: FontStyle.italic,
                  ),
                ),
              ],
              
              const SizedBox(height: AppSpacing.md),
              
              // Footer with timestamps
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Created: ${object.formattedCreationTime}',
                    style: const TextStyle(
                      fontSize: AppFontSizes.sm,
                      color: AppColors.textSecondary,
                    ),
                  ),
                  if (object.lastUpdateTime != null)
                    Text(
                      'Updated: ${object.formattedLastUpdateTime}',
                      style: const TextStyle(
                        fontSize: AppFontSizes.sm,
                        color: AppColors.textSecondary,
                      ),
                    ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  /// Build a small badge widget
  Widget _buildBadge(String text, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.sm,
        vertical: AppSpacing.xs,
      ),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(AppBorderRadius.sm),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Text(
        text,
        style: TextStyle(
          fontSize: AppFontSizes.sm,
          color: color,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  /// Format property value for display
  String _formatPropertyValue(dynamic value) {
    if (value == null) return 'null';
    if (value is String) {
      return value.length > 100 ? '${value.substring(0, 100)}...' : value;
    }
    if (value is List) {
      return '[${value.length} items]';
    }
    if (value is Map) {
      return '{${value.length} keys}';
    }
    return value.toString();
  }
}

/// Empty state widget for when no objects are found
class EmptyObjectsState extends StatelessWidget {
  final String? collectionName;
  final VoidCallback? onRetry;

  const EmptyObjectsState({
    super.key,
    this.collectionName,
    this.onRetry,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.xl),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(
            Icons.search_off,
            size: 64,
            color: AppColors.secondary,
          ),
          const SizedBox(height: AppSpacing.lg),
          Text(
            'No Objects Found',
            style: AppTextStyles.title.copyWith(
              color: AppColors.secondary,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(
            collectionName != null
                ? 'Collection "$collectionName" appears to be empty'
                : 'No objects to display',
            style: AppTextStyles.body,
            textAlign: TextAlign.center,
          ),
          if (onRetry != null) ...[
            const SizedBox(height: AppSpacing.xl),
            ElevatedButton(
              onPressed: onRetry,
              child: const Text('Retry'),
            ),
          ],
        ],
      ),
    );
  }
}

/// Loading state widget for object loading
class ObjectsLoadingState extends StatelessWidget {
  final String? message;

  const ObjectsLoadingState({
    super.key,
    this.message,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.xl),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary),
          ),
          const SizedBox(height: AppSpacing.lg),
          Text(
            message ?? 'Loading objects...',
            style: AppTextStyles.body,
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}