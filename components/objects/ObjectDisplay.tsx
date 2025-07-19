import React from 'react';
import {
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import styled from 'styled-components/native';
import { WeaviateObject } from '../weaviate/WeaviateHttpClient';
import { theme } from '../../styles/theme';
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

// Styled Components
const ResultsSection = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.lg}px;
  margin-bottom: ${theme.spacing.xl}px;
  ${theme.shadows.small};
`;

const ResultsHeader = styled.View`
  margin-bottom: ${theme.spacing.lg}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding: ${theme.spacing.lg}px;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
`;

const ResultsInfo = styled.View`
  flex: 1;
  margin-right: ${theme.spacing.lg}px;
`;

const ResultsTitle = styled.Text`
  font-size: ${theme.fontSize.xl}px;
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: 4px;
`;

const ResultsSubtitle = styled.Text`
  font-size: ${theme.fontSize.md}px;
  color: ${theme.colors.text.secondary};
`;

const DataContainer = styled.View`
  flex: 1;
  padding-horizontal: ${theme.spacing.lg}px;
  padding-bottom: ${theme.spacing.lg}px;
`;

const ViewModeContainer = styled.View`
  flex-direction: row;
  background-color: #f0f0f0;
  border-radius: ${theme.borderRadius.md}px;
  padding: 2px;
`;

const ViewModeButton = styled.TouchableOpacity<{ active: boolean }>`
  padding-horizontal: ${theme.spacing.md}px;
  padding-vertical: 6px;
  border-radius: 6px;
  background-color: ${({ active }) => active ? theme.colors.primary : 'transparent'};
`;

const ViewModeText = styled.Text<{ active: boolean }>`
  font-size: ${theme.fontSize.md}px;
  color: ${({ active }) => active ? theme.colors.text.white : '#666'};
  font-weight: ${({ active }) => active ? theme.fontWeight.semibold : theme.fontWeight.normal};
`;

const ObjectsList = styled.ScrollView`
  flex: 1;
`;

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
    <ResultsSection>
      <ResultsHeader>
        <ResultsInfo>
          <ResultsTitle>
            {objects.length} object{objects.length !== 1 ? 's' : ''} in &quot;{collectionName}&quot;
          </ResultsTitle>
          <ResultsSubtitle>
            Last updated: {new Date().toLocaleTimeString()}
          </ResultsSubtitle>
        </ResultsInfo>

        <ViewModeContainer>
          <ViewModeButton
            active={viewMode === 'table'}
            onPress={() => onViewModeChange('table')}
          >
            <ViewModeText active={viewMode === 'table'}>
              📊 Table
            </ViewModeText>
          </ViewModeButton>
          <ViewModeButton
            active={viewMode === 'cards'}
            onPress={() => onViewModeChange('cards')}
          >
            <ViewModeText active={viewMode === 'cards'}>
              🗃️ Cards
            </ViewModeText>
          </ViewModeButton>
        </ViewModeContainer>
      </ResultsHeader>

      <DataContainer>
        {viewMode === 'table' ? (
          <ObjectTable objects={objects} onObjectPress={onObjectPress} />
        ) : (
          <ObjectsList
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.primary]}
                tintColor={theme.colors.primary}
              />
            }
            showsVerticalScrollIndicator={true}
          >
            {objects.map((object, index) => (
              <ObjectCard key={object.id} object={object} />
            ))}
          </ObjectsList>
        )}
      </DataContainer>
    </ResultsSection>
  );
}


