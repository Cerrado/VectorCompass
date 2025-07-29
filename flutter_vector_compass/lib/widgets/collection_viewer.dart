// Collection viewer widget - migrated from React Native CollectionViewer.tsx
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:rflutter_alert/rflutter_alert.dart';

import '../theme/app_theme.dart';
import '../models/weaviate_models.dart';
import '../services/weaviate_service.dart';
import '../screens/home_screen.dart';
import 'form_components.dart';
import 'object_display.dart';

/// Widget for viewing and managing Weaviate collections
/// Migrated from: components/collection/CollectionViewer.tsx
class CollectionViewerWidget extends StatefulWidget {
  const CollectionViewerWidget({super.key});

  @override
  State<CollectionViewerWidget> createState() => _CollectionViewerWidgetState();
}

class _CollectionViewerWidgetState extends State<CollectionViewerWidget> {
  final _collectionController = TextEditingController();
  
  List<WeaviateObject> _objects = [];
  bool _loading = false;
  bool _refreshing = false;
  List<String> _availableCollections = [];
  bool _showCollections = false;
  ViewMode _viewMode = ViewMode.table;
  CollectionSchema? _collectionSchema;
  bool _showProperties = false;
  bool _loadingSchema = false;

  @override
  void initState() {
    super.initState();
    _loadAvailableCollections();
  }

  @override
  void dispose() {
    _collectionController.dispose();
    super.dispose();
  }

  /// Load available collections from Weaviate
  /// Migrated from: loadAvailableCollections function in CollectionViewer.tsx
  Future<void> _loadAvailableCollections() async {
    try {
      final weaviateService = context.read<WeaviateService>();
      if (weaviateService.isConnected) {
        final collections = await weaviateService.getCollections();
        setState(() {
          _availableCollections = collections;
        });
      }
    } catch (error) {
      debugPrint('Failed to load collections: $error');
    }
  }

  /// Load objects from a collection
  /// Migrated from: handleLoadCollection function in CollectionViewer.tsx
  Future<void> _handleLoadCollection() async {
    final collectionName = _collectionController.text.trim();
    if (collectionName.isEmpty) {
      _showAlert('Error', 'Please enter a collection name');
      return;
    }

    final weaviateService = context.read<WeaviateService>();
    if (!weaviateService.isConnected) {
      _showAlert('Error', 'Not connected to Weaviate');
      return;
    }

    setState(() {
      _loading = true;
    });

    try {
      final objects = await weaviateService.getObjectsFromCollection(collectionName);
      setState(() {
        _objects = objects;
      });

      if (objects.isEmpty) {
        _showAlert('Info', 'Collection "$collectionName" is empty or doesn\'t exist');
      }
    } catch (error) {
      _showAlert('Error', 'Failed to load collection: $error');
      setState(() {
        _objects = [];
      });
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  /// Refresh current collection
  /// Migrated from: handleRefresh function in CollectionViewer.tsx
  Future<void> _handleRefresh() async {
    final collectionName = _collectionController.text.trim();
    if (collectionName.isEmpty) return;

    setState(() {
      _refreshing = true;
    });

    try {
      final weaviateService = context.read<WeaviateService>();
      final objects = await weaviateService.getObjectsFromCollection(collectionName);
      setState(() {
        _objects = objects;
      });
    } catch (error) {
      _showAlert('Error', 'Failed to refresh collection: $error');
    } finally {
      setState(() {
        _refreshing = false;
      });
    }
  }

  /// Load collection schema
  /// Migrated from: loadCollectionSchema function in CollectionViewer.tsx
  Future<void> _loadCollectionSchema(String collectionName) async {
    final weaviateService = context.read<WeaviateService>();
    if (!weaviateService.isConnected) return;

    setState(() {
      _loadingSchema = true;
    });

    try {
      final schema = await weaviateService.getCollectionSchema(collectionName);
      setState(() {
        _collectionSchema = schema;
      });
    } catch (error) {
      debugPrint('Failed to load collection schema: $error');
      setState(() {
        _collectionSchema = null;
      });
    } finally {
      setState(() {
        _loadingSchema = false;
      });
    }
  }

  /// Select a collection from the list
  /// Migrated from: selectCollection function in CollectionViewer.tsx
  void _selectCollection(String collectionName) {
    _collectionController.text = collectionName;
    setState(() {
      _showCollections = false;
      _showProperties = true;
    });
    _loadCollectionSchema(collectionName);
  }

  /// Delete a collection
  /// Migrated from: handleDeleteCollection function in CollectionViewer.tsx
  Future<void> _handleDeleteCollection(String collectionName) async {
    Alert(
      context: context,
      type: AlertType.warning,
      title: 'Delete Collection',
      desc: 'Are you sure you want to delete the collection "$collectionName"? This action cannot be undone.',
      buttons: [
        DialogButton(
          onPressed: () => Navigator.pop(context),
          color: AppColors.secondary,
          child: const Text('Cancel', style: TextStyle(color: Colors.white)),
        ),
        DialogButton(
          onPressed: () async {
            Navigator.pop(context);
            await _performDeleteCollection(collectionName);
          },
          color: AppColors.destructive,
          child: const Text('Delete', style: TextStyle(color: Colors.white)),
        ),
      ],
    ).show();
  }

  /// Perform the actual collection deletion
  Future<void> _performDeleteCollection(String collectionName) async {
    setState(() {
      _loading = true;
    });

    try {
      final weaviateService = context.read<WeaviateService>();
      final success = await weaviateService.deleteCollection(collectionName);
      
      if (success) {
        _showAlert('Success', 'Collection "$collectionName" has been deleted.');
        await _loadAvailableCollections();
        
        if (_collectionController.text == collectionName) {
          _collectionController.clear();
          setState(() {
            _objects = [];
          });
        }
      }
    } catch (error) {
      _showAlert('Error', 'Failed to delete collection: $error');
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  /// Handle object press
  /// Migrated from: handleObjectPress function in CollectionViewer.tsx
  void _handleObjectPress(WeaviateObject object) {
    _showAlert(
      'Object Details',
      'ID: ${object.id}\nClass: ${object.className}\nProperties: ${object.propertyCount}',
    );
  }

  /// Show alert dialog
  void _showAlert(String title, String message) {
    Alert(
      context: context,
      type: title == 'Success' ? AlertType.success : 
            title == 'Info' ? AlertType.info : AlertType.error,
      title: title,
      desc: message,
      buttons: [
        DialogButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('OK', style: TextStyle(color: Colors.white)),
        ),
      ],
    ).show();
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Text(
              'Collection Viewer',
              style: AppTextStyles.title,
            ),
            const SizedBox(height: AppSpacing.sm),
            Text(
              'Browse objects in your Weaviate collections',
              style: AppTextStyles.subtitle,
            ),
            const SizedBox(height: AppSpacing.xxl),

            // Collection selector
            _buildCollectionSelector(),
            
            // Collection properties
            if (_showProperties && _collectionSchema != null)
              _buildCollectionProperties(),

            // Object display
            if (_objects.isNotEmpty)
              _buildObjectDisplay(),

            // Loading overlay
            if (_loading)
              const Padding(
                padding: EdgeInsets.all(AppSpacing.xl),
                child: FormLoadingState(message: 'Loading...'),
              ),
          ],
        ),
      ),
    );
  }

  /// Build collection selector UI
  Widget _buildCollectionSelector() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Expanded(
              child: FormFieldWidget(
                label: 'Collection Name',
                controller: _collectionController,
                placeholder: 'Enter collection name',
              ),
            ),
            const SizedBox(width: AppSpacing.md),
            ElevatedButton(
              onPressed: _showCollections ? null : () {
                setState(() {
                  _showCollections = !_showCollections;
                });
              },
              child: Text(_showCollections ? 'Hide' : 'Browse'),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.lg),
        
        // Available collections list
        if (_showCollections)
          _buildCollectionsList(),

        // Load button
        SizedBox(
          width: double.infinity,
          child: SubmitButtonWidget(
            title: 'Load Collection',
            onPressed: _handleLoadCollection,
            isLoading: _loading,
            loadingText: 'Loading...',
          ),
        ),
      ],
    );
  }

  /// Build collections list
  Widget _buildCollectionsList() {
    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.lg),
      decoration: BoxDecoration(
        border: Border.all(color: AppColors.border),
        borderRadius: BorderRadius.circular(AppBorderRadius.md),
      ),
      child: Column(
        children: _availableCollections.map((collection) {
          return ListTile(
            title: Text(collection),
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                IconButton(
                  icon: const Icon(Icons.info_outline),
                  onPressed: () => _selectCollection(collection),
                  tooltip: 'View Properties',
                ),
                IconButton(
                  icon: const Icon(Icons.delete, color: AppColors.destructive),
                  onPressed: () => _handleDeleteCollection(collection),
                  tooltip: 'Delete Collection',
                ),
              ],
            ),
            onTap: () => _selectCollection(collection),
          );
        }).toList(),
      ),
    );
  }

  /// Build collection properties display
  Widget _buildCollectionProperties() {
    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.lg),
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.shade.withOpacity(0.3),
        borderRadius: BorderRadius.circular(AppBorderRadius.md),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Collection Properties',
                style: const TextStyle(
                  fontSize: AppFontSizes.lg,
                  fontWeight: FontWeight.w600,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close),
                onPressed: () {
                  setState(() {
                    _showProperties = false;
                  });
                },
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),
          if (_loadingSchema)
            const FormLoadingState(message: 'Loading schema...')
          else if (_collectionSchema != null) ...[
            Text('Class: ${_collectionSchema!.className}'),
            if (_collectionSchema!.description != null)
              Text('Description: ${_collectionSchema!.description}'),
            Text('Properties: ${_collectionSchema!.properties.length}'),
            if (_collectionSchema!.vectorizer != null)
              Text('Vectorizer: ${_collectionSchema!.vectorizer}'),
          ],
        ],
      ),
    );
  }

  /// Build object display
  Widget _buildObjectDisplay() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: AppSpacing.lg),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Objects (${_objects.length})',
              style: const TextStyle(
                fontSize: AppFontSizes.lg,
                fontWeight: FontWeight.w600,
              ),
            ),
            Row(
              children: [
                IconButton(
                  icon: Icon(
                    _viewMode == ViewMode.table ? Icons.table_chart : Icons.view_agenda,
                  ),
                  onPressed: () {
                    setState(() {
                      _viewMode = _viewMode == ViewMode.table 
                          ? ViewMode.cards 
                          : ViewMode.table;
                    });
                  },
                  tooltip: 'Toggle View Mode',
                ),
                IconButton(
                  icon: const Icon(Icons.refresh),
                  onPressed: _refreshing ? null : _handleRefresh,
                  tooltip: 'Refresh',
                ),
              ],
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.md),
        ObjectDisplayWidget(
          objects: _objects,
          collectionName: _collectionController.text,
          viewMode: _viewMode,
          refreshing: _refreshing,
          onObjectPress: _handleObjectPress,
          onRefresh: _handleRefresh,
        ),
      ],
    );
  }
}

/// View mode enum
enum ViewMode {
  table,
  cards,
}