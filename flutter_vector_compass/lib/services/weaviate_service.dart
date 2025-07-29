
// Weaviate HTTP service - migrated from React Native WeaviateHttpClient.ts
// Uses Flutter's http package instead of fetch API
import 'dart:convert';
import 'dart:developer' as developer;
import 'package:http/http.dart' as http;
import '../models/weaviate_models.dart';

/// Exception thrown when Weaviate operations fail
class WeaviateException implements Exception {
  final String message;
  final int? statusCode;
  final String? details;

  const WeaviateException(this.message, {this.statusCode, this.details});

  @override
  String toString() {
    if (statusCode != null) {
      return 'WeaviateException: HTTP $statusCode - $message${details != null ? '\nDetails: $details' : ''}';
    }
    return 'WeaviateException: $message${details != null ? '\nDetails: $details' : ''}';
  }
}

/// HTTP-based Weaviate client for Flutter
/// Migrated from: WeaviateHttpService class in WeaviateHttpClient.ts
class WeaviateService {
  static final WeaviateService _instance = WeaviateService._internal();
  factory WeaviateService() => _instance;
  WeaviateService._internal();

  String _baseUrl = '';
  Map<String, String> _headers = {};
  bool _isConnected = false;

  /// Test connection and initialize the service
  /// Migrated from: connect method in WeaviateHttpClient.ts
  Future<bool> connect(WeaviateConfig config) async {
    try {
      _baseUrl = '${config.scheme}://${config.host}/v1';
      _headers = {
        'Content-Type': 'application/json',
      };

      if (config.apiKey != null && config.apiKey!.isNotEmpty) {
        _headers['Authorization'] = 'Bearer ${config.apiKey}';
      }

      // Test connection by getting meta info
      final response = await http.get(
        Uri.parse('$_baseUrl/meta'),
        headers: _headers,
      );

      if (response.statusCode == 200) {
        _isConnected = true;
        developer.log('Successfully connected to Weaviate at $_baseUrl');
        return true;
      } else {
        developer.log('Failed to connect to Weaviate: ${response.statusCode} ${response.reasonPhrase}');
        _isConnected = false;
        return false;
      }
    } catch (error) {
      developer.log('Failed to connect to Weaviate: $error');
      _isConnected = false;
      return false;
    }
  }

  /// Get list of available collections
  /// Migrated from: getCollections method in WeaviateHttpClient.ts
  Future<List<String>> getCollections() async {
    if (!_isConnected) {
      throw const WeaviateException('Not connected to Weaviate');
    }

    try {
      final response = await http.get(
        Uri.parse('$_baseUrl/schema'),
        headers: _headers,
      );

      if (response.statusCode != 200) {
        throw WeaviateException(
          'Failed to get collections',
          statusCode: response.statusCode,
          details: response.reasonPhrase,
        );
      }

      final Map<String, dynamic> schema = json.decode(response.body);
      final List<dynamic>? classes = schema['classes'];

      if (classes == null) return [];

      return classes
          .map((cls) => cls['class'] as String?)
          .where((className) => className != null)
          .cast<String>()
          .toList();
    } catch (error) {
      developer.log('Failed to get collections: $error');
      if (error is WeaviateException) rethrow;
      throw WeaviateException('Failed to get collections: $error');
    }
  }

  /// Helper method to safely parse timestamp values
  int? _parseTimestamp(dynamic value) {
    if (value == null) return null;

    if (value is int) {
      return value;
    } else if (value is String) {
      try {
        return int.parse(value);
      } catch (e) {
        developer.log('Failed to parse timestamp string: $value');
        return null;
      }
    } else if (value is num) {
      return value.toInt();
    }

    return null;
  }

  /// Get objects from a specific collection
  /// Migrated from: getObjectsFromCollection method in WeaviateHttpClient.ts
  Future<List<WeaviateObject>> getObjectsFromCollection(
      String collectionName, {
        int limit = 100,
      }) async {
    if (!_isConnected) {
      throw const WeaviateException('Not connected to Weaviate');
    }

    try {
      final query = {
        'query': '''
          {
            Get {
              $collectionName(limit: $limit) {
                _additional {
                  id
                  vector
                  creationTimeUnix
                  lastUpdateTimeUnix
                }
              }
            }
          }
        '''
      };

      final response = await http.post(
        Uri.parse('$_baseUrl/graphql'),
        headers: _headers,
        body: json.encode(query),
      );

      if (response.statusCode != 200) {
        throw WeaviateException(
          'Failed to get objects from collection',
          statusCode: response.statusCode,
          details: response.reasonPhrase,
        );
      }

      final Map<String, dynamic> result = json.decode(response.body);

      if (result['errors'] != null) {
        final List<dynamic> errors = result['errors'];
        final String errorMessage = errors.isNotEmpty
            ? errors[0]['message'] ?? 'Unknown GraphQL error'
            : 'Unknown GraphQL error';
        throw WeaviateException('GraphQL Error: $errorMessage');
      }

      final List<dynamic>? objects = result['data']?['Get']?[collectionName];
      if (objects == null) return [];

      return objects.map((obj) {
        final Map<String, dynamic> additional = obj['_additional'] ?? {};
        final Map<String, dynamic> properties = Map<String, dynamic>.from(obj);
        properties.remove('_additional');

        return WeaviateObject(
          id: additional['id'] ?? '',
          className: collectionName,
          properties: properties,
          vector: additional['vector'] != null
              ? List<double>.from(additional['vector'])
              : null,
          creationTimeUnix: _parseTimestamp(additional['creationTimeUnix']),
          lastUpdateTimeUnix: _parseTimestamp(additional['lastUpdateTimeUnix']),
        );
      }).toList();
    } catch (error) {
      developer.log('Failed to get objects from collection: $error');
      if (error is WeaviateException) rethrow;
      throw WeaviateException('Failed to get objects from collection: $error');
    }
  }

  /// Get schema for a specific collection
  /// Migrated from: getCollectionSchema method in WeaviateHttpClient.ts
  Future<CollectionSchema> getCollectionSchema(String collectionName) async {
    if (!_isConnected) {
      throw const WeaviateException('Not connected to Weaviate');
    }

    try {
      final response = await http.get(
        Uri.parse('$_baseUrl/schema/$collectionName'),
        headers: _headers,
      );

      if (response.statusCode != 200) {
        throw WeaviateException(
          'Failed to get collection schema',
          statusCode: response.statusCode,
          details: response.reasonPhrase,
        );
      }

      final Map<String, dynamic> schemaData = json.decode(response.body);
      return CollectionSchema.fromJson(schemaData);
    } catch (error) {
      developer.log('Failed to get collection schema: $error');
      if (error is WeaviateException) rethrow;
      throw WeaviateException('Failed to get collection schema: $error');
    }
  }

  /// Delete a collection
  /// Migrated from: deleteCollection method in WeaviateHttpClient.ts
  Future<bool> deleteCollection(String collectionName) async {
    if (!_isConnected) {
      throw const WeaviateException('Not connected to Weaviate');
    }

    try {
      final response = await http.delete(
        Uri.parse('$_baseUrl/schema/$collectionName'),
        headers: _headers,
      );

      if (response.statusCode == 200) {
        developer.log('Successfully deleted collection: $collectionName');
        return true;
      } else {
        throw WeaviateException(
          'Failed to delete collection',
          statusCode: response.statusCode,
          details: response.reasonPhrase,
        );
      }
    } catch (error) {
      developer.log('Failed to delete collection: $error');
      if (error is WeaviateException) rethrow;
      throw WeaviateException('Failed to delete collection: $error');
    }
  }

  /// Get Weaviate instance metadata
  Future<Map<String, dynamic>> getMeta() async {
    if (!_isConnected) {
      throw const WeaviateException('Not connected to Weaviate');
    }

    try {
      final response = await http.get(
        Uri.parse('$_baseUrl/meta'),
        headers: _headers,
      );

      if (response.statusCode != 200) {
        throw WeaviateException(
          'Failed to get meta information',
          statusCode: response.statusCode,
          details: response.reasonPhrase,
        );
      }

      return json.decode(response.body);
    } catch (error) {
      developer.log('Failed to get meta information: $error');
      if (error is WeaviateException) rethrow;
      throw WeaviateException('Failed to get meta information: $error');
    }
  }

  /// Check if client is connected
  /// Migrated from: isClientConnected method in WeaviateHttpClient.ts
  bool get isConnected => _isConnected;

  /// Get current base URL
  String get baseUrl => _baseUrl;

  /// Disconnect from Weaviate
  /// Migrated from: disconnect method in WeaviateHttpClient.ts
  void disconnect() {
    _baseUrl = '';
    _headers = {};
    _isConnected = false;
    developer.log('Disconnected from Weaviate');
  }

  /// Get current connection info
  Map<String, dynamic> get connectionInfo => {
    'baseUrl': _baseUrl,
    'isConnected': _isConnected,
    'hasApiKey': _headers.containsKey('Authorization'),
  };
}

/// Global instance of WeaviateService
/// Migrated from: weaviateHttpService export in WeaviateHttpClient.ts
final weaviateService = WeaviateService();