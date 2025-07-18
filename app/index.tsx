import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, ScrollView } from 'react-native';
import WeaviateConnection from '../components/WeaviateConnection';
import CollectionViewer from '../components/CollectionViewer';

export default function Index() {
  const [isConnected, setIsConnected] = useState(false);

  const handleConnected = () => {
    setIsConnected(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <WeaviateConnection onConnected={handleConnected} />
        {isConnected && <CollectionViewer />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
});
