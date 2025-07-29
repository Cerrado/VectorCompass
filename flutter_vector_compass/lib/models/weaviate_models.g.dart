// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'weaviate_models.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

WeaviateConfig _$WeaviateConfigFromJson(Map<String, dynamic> json) =>
    WeaviateConfig(
      scheme: json['scheme'] as String,
      host: json['host'] as String,
      apiKey: json['apiKey'] as String?,
    );

Map<String, dynamic> _$WeaviateConfigToJson(WeaviateConfig instance) =>
    <String, dynamic>{
      'scheme': instance.scheme,
      'host': instance.host,
      'apiKey': instance.apiKey,
    };

WeaviateObject _$WeaviateObjectFromJson(Map<String, dynamic> json) =>
    WeaviateObject(
      id: json['id'] as String,
      className: json['className'] as String,
      properties: json['properties'] as Map<String, dynamic>,
      vector: (json['vector'] as List<dynamic>?)
          ?.map((e) => (e as num).toDouble())
          .toList(),
      creationTimeUnix: (json['creationTimeUnix'] as num?)?.toInt(),
      lastUpdateTimeUnix: (json['lastUpdateTimeUnix'] as num?)?.toInt(),
    );

Map<String, dynamic> _$WeaviateObjectToJson(WeaviateObject instance) =>
    <String, dynamic>{
      'id': instance.id,
      'className': instance.className,
      'properties': instance.properties,
      'vector': instance.vector,
      'creationTimeUnix': instance.creationTimeUnix,
      'lastUpdateTimeUnix': instance.lastUpdateTimeUnix,
    };

CollectionSchema _$CollectionSchemaFromJson(Map<String, dynamic> json) =>
    CollectionSchema(
      className: json['className'] as String,
      description: json['description'] as String?,
      properties: (json['properties'] as List<dynamic>)
          .map((e) => PropertySchema.fromJson(e as Map<String, dynamic>))
          .toList(),
      vectorizer: json['vectorizer'] as String?,
      moduleConfig: json['moduleConfig'] as Map<String, dynamic>?,
    );

Map<String, dynamic> _$CollectionSchemaToJson(CollectionSchema instance) =>
    <String, dynamic>{
      'className': instance.className,
      'description': instance.description,
      'properties': instance.properties,
      'vectorizer': instance.vectorizer,
      'moduleConfig': instance.moduleConfig,
    };

PropertySchema _$PropertySchemaFromJson(Map<String, dynamic> json) =>
    PropertySchema(
      name: json['name'] as String,
      dataType:
          (json['dataType'] as List<dynamic>).map((e) => e as String).toList(),
      description: json['description'] as String?,
      tokenization: json['tokenization'] as bool?,
      moduleConfig: json['moduleConfig'] as Map<String, dynamic>?,
    );

Map<String, dynamic> _$PropertySchemaToJson(PropertySchema instance) =>
    <String, dynamic>{
      'name': instance.name,
      'dataType': instance.dataType,
      'description': instance.description,
      'tokenization': instance.tokenization,
      'moduleConfig': instance.moduleConfig,
    };
