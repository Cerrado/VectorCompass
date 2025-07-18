import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { weaviateHttpService, WeaviateObject } from './WeaviateHttpClient';
import ObjectTable from './ObjectTable';

export default function CollectionViewer() {
  const [collectionName, setCollectionName] = useState('');
  const [objects, setObjects] = useState<WeaviateObject[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [availableCollections, setAvailableCollections] = useState<string[]>([]);
  const [showCollections, setShowCollections] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');

  useEffect(() => {
    loadAvailableCollections();
  }, []);

  const loadAvailableCollections = async () => {
    try {
      if (weaviateHttpService.isClientConnected()) {
        const collections = await weaviateHttpService.getCollections();
        setAvailableCollections(collections);
      }
    } catch (error) {
      console.error('Failed to load collections:', error);
    }
  };

  const handleLoadCollection = async () => {
    if (!collectionName.trim()) {
      Alert.alert('Error', 'Please enter a collection name');
      return;
    }

    if (!weaviateHttpService.isClientConnected()) {
      Alert.alert('Error', 'Not connected to Weaviate');
      return;
    }

    setLoading(true);
    try {
      const collectionObjects = await weaviateHttpService.getObjectsFromCollection(collectionName);
      setObjects(collectionObjects);
      
      if (collectionObjects.length === 0) {
        Alert.alert('Info', `Collection "${collectionName}" is empty or doesn't exist`);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to load collection: ${error}`);
      setObjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!collectionName.trim()) return;
    
    setRefreshing(true);
    try {
      const collectionObjects = await weaviateHttpService.getObjectsFromCollection(collectionName);
      setObjects(collectionObjects);
    } catch (error) {
      Alert.alert('Error', `Failed to refresh collection: ${error}`);
    } finally {
      setRefreshing(false);
    }
  };

  const selectCollection = (collection: string) => {
    setCollectionName(collection);
    setShowCollections(false);
  };

  const handleObjectPress = (object: WeaviateObject) => {
    Alert.alert(
      'Object Details',
      `ID: ${object.id}\nClass: ${object.class}\nProperties: ${Object.keys(object.properties).length}`,
      [{ text: 'OK' }]
    );
  };

  const renderProperty = (key: string, value: any): string => {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  const renderObjectCard = (object: WeaviateObject, index: number) => {
    const propertyKeys = Object.keys(object.properties);
    
    return (
      <View key={object.id} style={styles.objectCard}>
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
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Collection Viewer</Text>
        <Text style={styles.subtitle}>Browse objects in your Weaviate collections</Text>
      </View>
      
      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>Collection Name</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={collectionName}
            onChangeText={setCollectionName}
            placeholder="Enter collection name or browse below"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={[styles.suggestionButton, showCollections && styles.suggestionButtonActive]}
            onPress={() => setShowCollections(!showCollections)}
          >
            <Text style={styles.suggestionButtonText}>
              {showCollections ? '📂' : '📋'}
            </Text>
          </TouchableOpacity>
        </View>

        {showCollections && availableCollections.length > 0 && (
          <View style={styles.collectionsDropdown}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>Available Collections ({availableCollections.length})</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowCollections(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView 
              style={styles.collectionsScrollView}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              {availableCollections.map((collection, index) => (
                <TouchableOpacity
                  key={collection}
                  style={[
                    styles.collectionOption,
                    index === availableCollections.length - 1 && styles.lastCollectionOption
                  ]}
                  onPress={() => selectCollection(collection)}
                >
                  <View style={styles.collectionOptionContent}>
                    <Text style={styles.collectionOptionText} numberOfLines={1}>
                      {collection}
                    </Text>
                    <View style={styles.collectionBadge}>
                      <Text style={styles.collectionBadgeText}>Collection</Text>
                    </View>
                  </View>
                  <Text style={styles.selectIcon}>→</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <TouchableOpacity
          style={[styles.loadButton, loading && styles.loadButtonDisabled]}
          onPress={handleLoadCollection}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.loadButtonText}>Load Collection</Text>
          )}
        </TouchableOpacity>
      </View>

      {objects.length > 0 && (
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
                onPress={() => setViewMode('table')}
              >
                <Text style={[styles.viewModeText, viewMode === 'table' && styles.viewModeTextActive]}>
                  📊 Table
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.viewModeButton, viewMode === 'cards' && styles.viewModeButtonActive]}
                onPress={() => setViewMode('cards')}
              >
                <Text style={[styles.viewModeText, viewMode === 'cards' && styles.viewModeTextActive]}>
                  🗃️ Cards
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.dataContainer}>
            {viewMode === 'table' ? (
              <ObjectTable objects={objects} onObjectPress={handleObjectPress} />
            ) : (
              <ScrollView
                style={styles.objectsList}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    colors={['#007AFF']}
                    tintColor="#007AFF"
                  />
                }
                showsVerticalScrollIndicator={true}
              >
                {objects.map((object, index) => renderObjectCard(object, index))}
              </ScrollView>
            )}
          </View>
        </View>
      )}

      {!loading && objects.length === 0 && collectionName && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>📭</Text>
          <Text style={styles.emptyStateTitle}>No Objects Found</Text>
          <Text style={styles.emptyStateText}>
            Collection &quot;{collectionName}&quot; appears to be empty or doesn&apos;t exist.
          </Text>
          <Text style={styles.emptyStateHint}>
            • Check the collection name spelling{'\n'}
            • Ensure the collection exists in your Weaviate instance{'\n'}
            • Verify your connection settings
          </Text>
        </View>
      )}

      {loading && (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading collection data...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#212529',
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 22,
  },
  inputSection: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  suggestionButton: {
    backgroundColor: '#e9ecef',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ced4da',
    minWidth: 48,
    alignItems: 'center',
  },
  suggestionButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  suggestionButtonText: {
    fontSize: 18,
  },
  collectionsDropdown: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    marginBottom: 10,
    maxHeight: 280,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  closeButton: {
    backgroundColor: '#e9ecef',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: 'bold',
  },
  collectionsScrollView: {
    maxHeight: 200,
  },
  dropdownTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    flex: 1,
  },
  collectionOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lastCollectionOption: {
    borderBottomWidth: 0,
  },
  collectionOptionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  collectionOptionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  collectionBadge: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  collectionBadgeText: {
    fontSize: 10,
    color: '#6c757d',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  selectIcon: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 8,
  },
  loadButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  loadButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
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
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  emptyStateHint: {
    fontSize: 14,
    color: '#adb5bd',
    textAlign: 'left',
    lineHeight: 20,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
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
  loadingText: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 16,
    textAlign: 'center',
  },
});
