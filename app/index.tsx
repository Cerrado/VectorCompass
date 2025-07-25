import React, { useState } from 'react';
import { SafeAreaView, StatusBar, ScrollView } from 'react-native';
import WeaviateConnection from '../components/weaviate/WeaviateConnection';
import CollectionViewer from '../components/collection/CollectionViewer';

export default function Index() {
  const [isConnected, setIsConnected] = useState(false);

  const handleConnected = () => {
    setIsConnected(true);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#3b82f6" />
      <ScrollView 
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        <WeaviateConnection onConnected={handleConnected} />
        {isConnected && <CollectionViewer />}
      </ScrollView>
    </SafeAreaView>
  );
}
