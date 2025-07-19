import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

interface CollectionSelectorProps {
  collectionName: string;
  onCollectionNameChange: (name: string) => void;
  availableCollections: string[];
  showCollections: boolean;
  onToggleCollections: () => void;
  onSelectCollection: (collection: string) => void;
  onDeleteCollection: (collection: string) => void;
  onLoadCollection: () => void;
  loading: boolean;
}

export default function CollectionSelector({
  collectionName,
  onCollectionNameChange,
  availableCollections,
  showCollections,
  onToggleCollections,
  onSelectCollection,
  onDeleteCollection,
  onLoadCollection,
  loading,
}: CollectionSelectorProps) {
  return (
    <View style={styles.inputSection}>
      <Text style={styles.inputLabel}>Collection Name</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={collectionName}
          onChangeText={onCollectionNameChange}
          placeholder="Enter collection name or browse below"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={[styles.suggestionButton, showCollections && styles.suggestionButtonActive]}
          onPress={onToggleCollections}
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
              onPress={onToggleCollections}
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
                  onPress={() => onSelectCollection(collection)}
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
                    onPress={() => onDeleteCollection(collection)}
                    accessibilityLabel={`Delete collection ${collection}`}
                  >
                    <Text style={styles.deleteButtonText}>🗑️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => onSelectCollection(collection)}
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
        onPress={onLoadCollection}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.loadButtonText}>Load Collection</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
