import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { WeaviateObject } from '../weaviate/WeaviateHttpClient';

interface ObjectCardProps {
  object: WeaviateObject;
}

export default function ObjectCard({ object }: ObjectCardProps) {
  const renderProperty = (key: string, value: any): string => {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  const propertyKeys = Object.keys(object.properties);

  return (
    <View style={styles.objectCard}>
      <View style={styles.objectHeader}>
        <Text style={styles.objectId}>ID: {object.id}</Text>
        <Text style={styles.objectClass}>Class: {object.class}</Text>
      </View>

      <View style={styles.propertiesContainer}>
        <Text style={styles.propertiesTitle}>Properties:</Text>
        {propertyKeys.length > 0 ? (
          <View style={styles.propertyList}>
            {propertyKeys.map((key) => (
              <View key={key} style={styles.propertyRow}>
                <Text style={styles.propertyKey}>{key}:</Text>
                <Text style={styles.propertyValue} numberOfLines={3}>
                  {renderProperty(key, object.properties[key])}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noProperties}>No properties</Text>
        )}
      </View>

      {object.vector && (
        <View style={styles.vectorInfo}>
          <Text style={styles.vectorText}>
            Vector: [{object.vector.length} dimensions]
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  objectCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  objectHeader: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  objectId: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  objectClass: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  propertiesContainer: {
    marginBottom: 10,
  },
  propertiesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  propertyList: {
    gap: 5,
  },
  propertyRow: {
    flexDirection: 'row',
    paddingVertical: 2,
  },
  propertyKey: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    minWidth: 100,
    marginRight: 10,
  },
  propertyValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  noProperties: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  vectorInfo: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  vectorText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});
