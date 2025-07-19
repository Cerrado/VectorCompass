import React, { JSX } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

interface CollectionPropertiesProps {
  show: boolean;
  collectionName: string;
  collectionSchema: any;
  loadingSchema: boolean;
  onClose: () => void;
}

export default function CollectionProperties({
  show,
  collectionName,
  collectionSchema,
  loadingSchema,
  onClose,
}: CollectionPropertiesProps) {
  const renderNestedProperties = (properties: any[], level: number = 0): JSX.Element[] => {
    return properties.map((property: any, index: number) => {
      const dataType = property.dataType?.[0] || 'unknown';
      const isObjectType = dataType === 'object' || dataType === 'object[]';
      const indentStyle = level > 0 ? { marginLeft: level * 20 } : {};

      return (
        <View key={`${level}-${index}`} style={[styles.propertyItem, indentStyle]}>
          <View style={styles.propertyHeader}>
            <Text style={styles.propertyName}>
              {level > 0 && '└─ '}{property.name}
            </Text>
            <View style={[
              styles.propertyTypeBadge,
              isObjectType && styles.objectTypeBadge
            ]}>
              <Text style={[
                styles.propertyTypeText,
                isObjectType && styles.objectTypeText
              ]}>
                {dataType}
              </Text>
            </View>
          </View>

          {property.description && (
            <Text style={styles.propertyDescription}>{property.description}</Text>
          )}

          <View style={styles.propertyDetails}>
            {property.tokenization && (
              <Text style={styles.propertyDetail}>Tokenization: {property.tokenization}</Text>
            )}
            {property.indexFilterable !== undefined && (
              <Text style={styles.propertyDetail}>
                Filterable: {property.indexFilterable ? 'Yes' : 'No'}
              </Text>
            )}
            {property.indexSearchable !== undefined && (
              <Text style={styles.propertyDetail}>
                Searchable: {property.indexSearchable ? 'Yes' : 'No'}
              </Text>
            )}
          </View>

          {isObjectType && (property.nestedProperties || property.properties) && (
            <View style={styles.nestedPropertiesContainer}>
              <Text style={styles.nestedPropertiesTitle}>Nested Properties:</Text>
              {property.nestedProperties && property.nestedProperties.length > 0 
                ? renderNestedProperties(property.nestedProperties, level + 1)
                : property.properties && property.properties.length > 0
                ? renderNestedProperties(property.properties, level + 1)
                : <Text style={styles.noPropertiesText}>No nested properties defined</Text>
              }
            </View>
          )}
        </View>
      );
    });
  };

  if (!show || !collectionName) {
    return null;
  }

  return (
    <View style={styles.propertiesSection}>
      <View style={styles.propertiesSectionHeader}>
        <Text style={styles.propertiesSectionTitle}>
          Collection Properties: &quot;{collectionName}&quot;
        </Text>
        <TouchableOpacity
          style={styles.togglePropertiesButton}
          onPress={onClose}
        >
          <Text style={styles.togglePropertiesButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      {loadingSchema ? (
        <View style={styles.schemaLoadingState}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.schemaLoadingText}>Loading schema...</Text>
        </View>
      ) : collectionSchema ? (
        <ScrollView style={styles.propertiesScrollView} showsVerticalScrollIndicator={true}>
          <View style={styles.schemaContainer}>
            <Text style={styles.schemaTitle}>Schema Information</Text>

            {collectionSchema.properties && collectionSchema.properties.length > 0 ? (
              <View style={styles.propertiesList}>
                {renderNestedProperties(collectionSchema.properties)}
              </View>
            ) : (
              <Text style={styles.noPropertiesText}>No properties found in schema</Text>
            )}

            {collectionSchema.vectorizer && (
              <View style={styles.vectorizerInfo}>
                <Text style={styles.vectorizerTitle}>Vectorizer</Text>
                <Text style={styles.vectorizerText}>{collectionSchema.vectorizer}</Text>
              </View>
            )}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.schemaErrorState}>
          <Text style={styles.schemaErrorText}>Failed to load schema</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  propertiesSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  propertiesSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  propertiesSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    flex: 1,
  },
  togglePropertiesButton: {
    backgroundColor: '#e9ecef',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  togglePropertiesButtonText: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: 'bold',
  },
  propertiesScrollView: {
    maxHeight: 400,
  },
  schemaContainer: {
    padding: 16,
  },
  schemaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 12,
  },
  propertiesList: {
    gap: 12,
  },
  propertyItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  propertyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    flex: 1,
  },
  propertyTypeBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  objectTypeBadge: {
    backgroundColor: '#28a745',
  },
  propertyTypeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  objectTypeText: {
    color: '#fff',
    fontWeight: '600',
  },
  propertyDescription: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
    lineHeight: 20,
  },
  propertyDetails: {
    gap: 4,
  },
  propertyDetail: {
    fontSize: 12,
    color: '#495057',
    backgroundColor: '#e9ecef',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  noPropertiesText: {
    fontSize: 14,
    color: '#6c757d',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  vectorizerInfo: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#e7f3ff',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  vectorizerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 4,
  },
  vectorizerText: {
    fontSize: 14,
    color: '#6c757d',
  },
  schemaLoadingState: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 8,
  },
  schemaLoadingText: {
    fontSize: 14,
    color: '#6c757d',
  },
  schemaErrorState: {
    padding: 20,
    alignItems: 'center',
  },
  schemaErrorText: {
    fontSize: 14,
    color: '#dc3545',
    textAlign: 'center',
  },
  nestedPropertiesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    padding: 8,
  },
  nestedPropertiesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
});
