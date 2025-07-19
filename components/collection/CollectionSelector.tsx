import React from 'react';
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { styled } from 'styled-components/native';

import { theme } from '../../styles/theme';
import { Button, ButtonText, Input, Label } from '../../styles/components';

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

// Styled Components
const InputSection = styled.View`
  margin-bottom: ${theme.spacing.xl}px;
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.lg}px;
  padding: ${theme.spacing.lg}px;
  ${theme.shadows.small};
`;

const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${theme.spacing.md}px;
`;

const CollectionsDropdown = styled.View`
  margin-top: ${theme.spacing.lg}px;
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.lg}px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  ${theme.shadows.small};
`;

const DropdownHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.md}px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
  background-color: ${theme.colors.surface};
  border-top-left-radius: ${theme.borderRadius.lg}px;
  border-top-right-radius: ${theme.borderRadius.lg}px;
`;

const DropdownTitle = styled.Text`
  font-size: ${theme.fontSize.lg}px;
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  text-align: center;
`;

const CollectionsList = styled.ScrollView`
  max-height: 200px;
`;

const CollectionItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.lg}px;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
`;

const CollectionBadge = styled.View`
  background-color: ${theme.colors.primary};
  padding: 4px 8px;
  border-radius: ${theme.borderRadius.sm}px;
`;

const CollectionName = styled.Text`
  color: ${theme.colors.text.white};
  font-size: ${theme.fontSize.sm}px;
  font-weight: ${theme.fontWeight.medium};
`;

const CollectionActions = styled.View`
  flex-direction: row;
  gap: ${theme.spacing.sm}px;
`;

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
    <InputSection>
      <Label>Collection Name</Label>
      <InputContainer>
        <Input
          value={collectionName}
          onChangeText={onCollectionNameChange}
          placeholder="Enter collection name or browse below"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Button
          variant="secondary"
          active={showCollections}
          onPress={onToggleCollections}
        >
          <ButtonText variant="secondary" active={showCollections}>
            {showCollections ? '📂' : '📋'}
          </ButtonText>
        </Button>
      </InputContainer>

      {showCollections && availableCollections.length > 0 && (
        <CollectionsDropdown>
          <DropdownHeader>
            <DropdownTitle>Available Collections ({availableCollections.length})</DropdownTitle>
            <Button
              variant="secondary"
              size="sm"
              onPress={onToggleCollections}
            >
              <ButtonText variant="secondary" size="sm">✕</ButtonText>
            </Button>
          </DropdownHeader>
          <CollectionsList
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          >
            {availableCollections.map((collection, index) => (
              <CollectionItem key={collection}>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
                  onPress={() => onSelectCollection(collection)}
                >
                  <Text style={{ flex: 1, fontSize: 14, color: theme.colors.text.primary }} numberOfLines={1}>
                    {collection}
                  </Text>
                  <CollectionBadge>
                    <CollectionName>Collection</CollectionName>
                  </CollectionBadge>
                </TouchableOpacity>
                <CollectionActions>
                  <Button
                    variant="destructive"
                    size="sm"
                    onPress={() => onDeleteCollection(collection)}
                  >
                    <ButtonText variant="destructive" size="sm">🗑️</ButtonText>
                  </Button>
                  <Button
                    size="sm"
                    onPress={() => onSelectCollection(collection)}
                  >
                    <ButtonText size="sm">→</ButtonText>
                  </Button>
                </CollectionActions>
              </CollectionItem>
            ))}
          </CollectionsList>
        </CollectionsDropdown>
      )}

      
      <Button
        onPress={onLoadCollection}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.text.white} />
        ) : (
          <ButtonText>Load Collection</ButtonText>
        )}
      </Button>
    </InputSection>
  );
}


