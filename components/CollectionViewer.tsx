import React, { useState, useEffect, JSX } from 'react';
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
  Platform,
} from 'react-native';
import { weaviateHttpService, WeaviateObject } from './WeaviateHttpClient';
import ObjectTable from './ObjectTable';
import CustomAlert from './CustomAlert';

export default function CollectionViewer() {
  const [collectionName, setCollectionName] = useState('');
  const [objects, setObjects] = useState<WeaviateObject[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [availableCollections, setAvailableCollections] = useState<string[]>([]);
  const [showCollections, setShowCollections] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [collectionSchema, setCollectionSchema] = useState<any>(null);
  const [showProperties, setShowProperties] = useState(false);
  const [loadingSchema, setLoadingSchema] = useState(false);

  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    buttons?: {
      text: string;
      onPress?: () => void;
      style?: 'default' | 'cancel' | 'destructive';
    }[];
  }>({
    visible: false,
    title: '',
    message: '',
    buttons: [],
  });

  const showAlert = (
    title: string, 
    message: string, 
    buttons?: {text: string, onPress?: () => void, style?: 'default' | 'cancel' | 'destructive'}[]
  ) => {
    if (Platform.OS === 'web') {
      setAlertConfig({
        visible: true,
        title,
        message,
        buttons: buttons || [{ text: 'OK' }],
      });
    } else {
      Alert.alert(title, message, buttons);
    }
  };

  const closeAlert = () => {
    setAlertConfig(prev => ({ ...prev, visible: false }));
  };

  useEffect(() => {
    loadAvailableCollections().then().catch(error => console.error('Failed to load collections:', error));
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
      showAlert('Error', 'Please enter a collection name');
      return;
    }

    if (!weaviateHttpService.isClientConnected()) {
      showAlert('Error', 'Not connected to Weaviate');
      return;
    }

    setLoading(true);
    try {
      const collectionObjects = await weaviateHttpService.getObjectsFromCollection(collectionName);
      setObjects(collectionObjects);

      if (collectionObjects.length === 0) {
        showAlert('Info', `Collection "${collectionName}" is empty or doesn't exist`);
      }
    } catch (error) {
      showAlert('Error', `Failed to load collection: ${error}`);
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
      showAlert('Error', `Failed to refresh collection: ${error}`);
    } finally {
      setRefreshing(false);
    }
  };

  const loadCollectionSchema = async (collection: string) => {
    if (!weaviateHttpService.isClientConnected()) {
      return;
    }

    setLoadingSchema(true);
    try {
      const schema = await weaviateHttpService.getCollectionSchema(collection);
      setCollectionSchema(schema);
    } catch (error) {
      console.error('Failed to load collection schema:', error);
      setCollectionSchema(null);
    } finally {
      setLoadingSchema(false);
    }
  };

  const selectCollection = (collection: string) => {
    setCollectionName(collection);
    setShowCollections(false);
    setShowProperties(true);
    loadCollectionSchema(collection).then().catch(error => console.error('Failed to load schema:', error));
  };

  const handleDeleteCollection = async (collection: string) => {
    showAlert(
      'Delete Collection',
      `Are you sure you want to delete the collection "${collection}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const success = await weaviateHttpService.deleteCollection(collection);
              if (success) {
                showAlert('Success', `Collection "${collection}" has been deleted.`);
                // Refresh the collections list
                await loadAvailableCollections();
                // Clear the current collection if it was the one deleted
                if (collectionName === collection) {
                  setCollectionName('');
                  setObjects([]);
                }
              }
            } catch (error) {
              showAlert('Error', `Failed to delete collection: ${error}`);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleObjectPress = (object: WeaviateObject) => {
    showAlert(
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
                <View
                  key={collection}
                  style={[
                    styles.collectionOption,
                    index === availableCollections.length - 1 && styles.lastCollectionOption
                  ]}
                >
                  <TouchableOpacity
                    style={styles.collectionOptionContent}
                    onPress={() => selectCollection(collection)}
                  >
                    <Text style={styles.collectionOptionText} numberOfLines={1}>
                      {collection}
                    </Text>
                    <View style={styles.collectionBadge}>
                      <Text style={styles.collectionBadgeText}>Collection</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.collectionActions}>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteCollection(collection)}
                      accessibilityLabel={`Delete collection ${collection}`}
                    >
                      <Text style={styles.deleteButtonText}>🗑️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => selectCollection(collection)}
                    >
                      <Text style={styles.selectIcon}>→</Text>
                    </TouchableOpacity>
                  </View>
                </View>
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

      {showProperties && collectionName && (
        <View style={styles.propertiesSection}>
          <View style={styles.propertiesSectionHeader}>
            <Text style={styles.propertiesSectionTitle}>
              Collection Properties: &quot;{collectionName}&quot;
            </Text>
            <TouchableOpacity
              style={styles.togglePropertiesButton}
              onPress={() => setShowProperties(!showProperties)}
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
      )}

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

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onClose={closeAlert}
      />
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
  collectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    marginRight: 12,
    padding: 4,
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#dc3545',
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