import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { WeaviateObject } from './WeaviateHttpClient';
import ObjectTable from './ObjectTable';
import ObjectCard from './ObjectCard';

interface ObjectDisplayProps {
  objects: WeaviateObject[];
  collectionName: string;
  viewMode: 'cards' | 'table';
  refreshing: boolean;
  onViewModeChange: (mode: 'cards' | 'table') => void;
  onObjectPress: (object: WeaviateObject) => void;
  onRefresh: () => void;
}

export default function ObjectDisplay({
  objects,
  collectionName,
  viewMode,
  refreshing,
  onViewModeChange,
  onObjectPress,
  onRefresh,
}: ObjectDisplayProps) {
  if (objects.length === 0) {
    return null;
  }

  return (
    <View style={styles.resultsSection}>
      <View style={styles.resultsHeader}>
        <View style={styles.resultsInfo}>
          <Text style={styles.resultsTitle}>
            {objects.length} object{objects.length !== 1 ? 's' : ''} in &quot;{collectionName}&quot;
          </Text>
          <Text style={styles.resultsSubtitle}>
            Last updated: {new Date().toLocaleTimeString()}
          </Text>
        </View>

        <View style={styles.viewModeContainer}>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'table' && styles.viewModeButtonActive]}
            onPress={() => onViewModeChange('table')}
          >
            <Text style={[styles.viewModeText, viewMode === 'table' && styles.viewModeTextActive]}>
              📊 Table
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'cards' && styles.viewModeButtonActive]}
            onPress={() => onViewModeChange('cards')}
          >
            <Text style={[styles.viewModeText, viewMode === 'cards' && styles.viewModeTextActive]}>
              🗃️ Cards
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.dataContainer}>
        {viewMode === 'table' ? (
          <ObjectTable objects={objects} onObjectPress={onObjectPress} />
        ) : (
          <ScrollView
            style={styles.objectsList}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#007AFF']}
                tintColor="#007AFF"
              />
            }
            showsVerticalScrollIndicator={true}
          >
            {objects.map((object, index) => (
              <ObjectCard key={object.id} object={object} />
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  resultsSection: {
    flex: 1,
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
  resultsHeader: {
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultsInfo: {
    flex: 1,
    marginRight: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  resultsSubtitle: {
    fontSize: 14,
    color: '#6c757d',
  },
  dataContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  viewModeContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 2,
  },
  viewModeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewModeButtonActive: {
    backgroundColor: '#007AFF',
  },
  viewModeText: {
    fontSize: 14,
    color: '#666',
  },
  viewModeTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  objectsList: {
    flex: 1,
  },
});
