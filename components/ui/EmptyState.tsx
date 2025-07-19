import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

interface EmptyStateProps {
  collectionName: string;
}

export default function EmptyState({ collectionName }: EmptyStateProps) {
  return (
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
  );
}

const styles = StyleSheet.create({
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
});
