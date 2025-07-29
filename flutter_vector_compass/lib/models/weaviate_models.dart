// Data models for Weaviate - migrated from TypeScript interfaces
import 'package:json_annotation/json_annotation.dart';

part 'weaviate_models.g.dart';

/// Configuration for connecting to Weaviate instance
/// Migrated from: WeaviateConfig interface in WeaviateHttpClient.ts
@JsonSerializable()
class WeaviateConfig {
  final String scheme; // 'http' or 'https'
  final String host;
  final String? apiKey;

  const WeaviateConfig({
    required this.scheme,
    required this.host,
    this.apiKey,
  });

  factory WeaviateConfig.fromJson(Map<String, dynamic> json) =>
      _$WeaviateConfigFromJson(json);

  Map<String, dynamic> toJson() => _$WeaviateConfigToJson(this);

  WeaviateConfig copyWith({
    String? scheme,
    String? host,
    String? apiKey,
  }) {
    return WeaviateConfig(
      scheme: scheme ?? this.scheme,
      host: host ?? this.host,
      apiKey: apiKey ?? this.apiKey,
    );
  }

  @override
  String toString() {
    return 'WeaviateConfig(scheme: $scheme, host: $host, apiKey: ${apiKey != null ? '[HIDDEN]' : 'null'})';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is WeaviateConfig &&
        other.scheme == scheme &&
        other.host == host &&
        other.apiKey == apiKey;
  }

  @override
  int get hashCode => scheme.hashCode ^ host.hashCode ^ apiKey.hashCode;
}

/// Represents a Weaviate object with its properties and metadata
/// Migrated from: WeaviateObject interface in WeaviateHttpClient.ts
@JsonSerializable()
class WeaviateObject {
  final String id;
  final String className; // renamed from 'class' to avoid Dart keyword conflict
  final Map<String, dynamic> properties;
  final List<double>? vector;
  final int? creationTimeUnix;
  final int? lastUpdateTimeUnix;

  const WeaviateObject({
    required this.id,
    required this.className,
    required this.properties,
    this.vector,
    this.creationTimeUnix,
    this.lastUpdateTimeUnix,
  });

  factory WeaviateObject.fromJson(Map<String, dynamic> json) =>
      _$WeaviateObjectFromJson(json);

  Map<String, dynamic> toJson() => _$WeaviateObjectToJson(this);

  WeaviateObject copyWith({
    String? id,
    String? className,
    Map<String, dynamic>? properties,
    List<double>? vector,
    int? creationTimeUnix,
    int? lastUpdateTimeUnix,
  }) {
    return WeaviateObject(
      id: id ?? this.id,
      className: className ?? this.className,
      properties: properties ?? this.properties,
      vector: vector ?? this.vector,
      creationTimeUnix: creationTimeUnix ?? this.creationTimeUnix,
      lastUpdateTimeUnix: lastUpdateTimeUnix ?? this.lastUpdateTimeUnix,
    );
  }

  /// Get creation time as DateTime if available
  DateTime? get creationTime {
    if (creationTimeUnix == null) return null;
    return DateTime.fromMillisecondsSinceEpoch(creationTimeUnix! * 1000);
  }

  /// Get last update time as DateTime if available
  DateTime? get lastUpdateTime {
    if (lastUpdateTimeUnix == null) return null;
    return DateTime.fromMillisecondsSinceEpoch(lastUpdateTimeUnix! * 1000);
  }

  /// Get formatted creation time string
  String get formattedCreationTime {
    final time = creationTime;
    if (time == null) return 'Unknown';
    return '${time.day}/${time.month}/${time.year} ${time.hour}:${time.minute.toString().padLeft(2, '0')}';
  }

  /// Get formatted last update time string
  String get formattedLastUpdateTime {
    final time = lastUpdateTime;
    if (time == null) return 'Unknown';
    return '${time.day}/${time.month}/${time.year} ${time.hour}:${time.minute.toString().padLeft(2, '0')}';
  }

  /// Get the number of properties
  int get propertyCount => properties.length;

  /// Get vector dimension if vector exists
  int? get vectorDimension => vector?.length;

  @override
  String toString() {
    return 'WeaviateObject(id: $id, className: $className, properties: ${properties.length}, vector: ${vector?.length ?? 'null'})';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is WeaviateObject &&
        other.id == id &&
        other.className == className &&
        _mapEquals(other.properties, properties) &&
        _listEquals(other.vector, vector) &&
        other.creationTimeUnix == creationTimeUnix &&
        other.lastUpdateTimeUnix == lastUpdateTimeUnix;
  }

  @override
  int get hashCode {
    return id.hashCode ^
        className.hashCode ^
        properties.hashCode ^
        vector.hashCode ^
        creationTimeUnix.hashCode ^
        lastUpdateTimeUnix.hashCode;
  }

  // Helper methods for equality comparison
  static bool _mapEquals(Map<String, dynamic>? a, Map<String, dynamic>? b) {
    if (a == null) return b == null;
    if (b == null || a.length != b.length) return false;
    for (final key in a.keys) {
      if (!b.containsKey(key) || a[key] != b[key]) return false;
    }
    return true;
  }

  static bool _listEquals(List<double>? a, List<double>? b) {
    if (a == null) return b == null;
    if (b == null || a.length != b.length) return false;
    for (int i = 0; i < a.length; i++) {
      if (a[i] != b[i]) return false;
    }
    return true;
  }
}

/// Collection schema information
/// Used for displaying collection properties and structure
@JsonSerializable()
class CollectionSchema {
  final String className;
  final String? description;
  final List<PropertySchema> properties;
  final String? vectorizer;
  final Map<String, dynamic>? moduleConfig;

  const CollectionSchema({
    required this.className,
    this.description,
    required this.properties,
    this.vectorizer,
    this.moduleConfig,
  });

  factory CollectionSchema.fromJson(Map<String, dynamic> json) =>
      _$CollectionSchemaFromJson(json);

  Map<String, dynamic> toJson() => _$CollectionSchemaToJson(this);

  @override
  String toString() {
    return 'CollectionSchema(className: $className, properties: ${properties.length})';
  }
}

/// Property schema for a collection
@JsonSerializable()
class PropertySchema {
  final String name;
  final List<String> dataType;
  final String? description;
  final bool? tokenization;
  final Map<String, dynamic>? moduleConfig;

  const PropertySchema({
    required this.name,
    required this.dataType,
    this.description,
    this.tokenization,
    this.moduleConfig,
  });

  factory PropertySchema.fromJson(Map<String, dynamic> json) =>
      _$PropertySchemaFromJson(json);

  Map<String, dynamic> toJson() => _$PropertySchemaToJson(this);

  /// Get the primary data type (first in the list)
  String get primaryDataType => dataType.isNotEmpty ? dataType.first : 'unknown';

  @override
  String toString() {
    return 'PropertySchema(name: $name, dataType: $dataType)';
  }
}