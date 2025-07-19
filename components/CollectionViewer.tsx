import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import CollectionSelector from './CollectionSelector';
import CollectionProperties from './CollectionProperties';
import ObjectDisplay from './ObjectDisplay';
import EmptyState from './EmptyState';
import LoadingState from './LoadingState';
import {weaviateHttpService, WeaviateObject} from "@/components/weaviate";
import {CustomAlert} from "@/components/ui";

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Collection Viewer</Text>
        <Text style={styles.subtitle}>Browse objects in your Weaviate collections</Text>
      </View>

      <CollectionSelector
        collectionName={collectionName}
        onCollectionNameChange={setCollectionName}
        availableCollections={availableCollections}
        showCollections={showCollections}
        onToggleCollections={() => setShowCollections(!showCollections)}
        onSelectCollection={selectCollection}
        onDeleteCollection={handleDeleteCollection}
        onLoadCollection={handleLoadCollection}
        loading={loading}
      />

      <CollectionProperties
        show={showProperties}
        collectionName={collectionName}
        collectionSchema={collectionSchema}
        loadingSchema={loadingSchema}
        onClose={() => setShowProperties(false)}
      />

      <ObjectDisplay
        objects={objects}
        collectionName={collectionName}
        viewMode={viewMode}
        refreshing={refreshing}
        onViewModeChange={setViewMode}
        onObjectPress={handleObjectPress}
        onRefresh={handleRefresh}
      />

      {!loading && objects.length === 0 && collectionName && (
        <EmptyState collectionName={collectionName} />
      )}

      {loading && (
        <LoadingState />
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
});