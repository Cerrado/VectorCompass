import React from 'react';
import { Text } from 'react-native';
import styled from 'styled-components/native';
import { WeaviateObject } from '../weaviate/WeaviateHttpClient';
import { theme } from '../../styles/theme';
import { Card } from '../../styles/components';

interface ObjectCardProps {
  object: WeaviateObject;
}

// Styled Components
const ObjectHeader = styled.View`
  margin-bottom: ${theme.spacing.md}px;
  padding-bottom: ${theme.spacing.md}px;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
`;

const ObjectId = styled.Text`
  font-size: ${theme.fontSize.sm}px;
  color: ${theme.colors.text.secondary};
  font-family: monospace;
`;

const ObjectClass = styled.Text`
  font-size: ${theme.fontSize.md}px;
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin-top: 2px;
`;

const PropertiesContainer = styled.View`
  margin-bottom: ${theme.spacing.md}px;
`;

const PropertiesTitle = styled.Text`
  font-size: ${theme.fontSize.lg}px;
  font-weight: ${theme.fontWeight.semibold};
  margin-bottom: ${theme.spacing.sm}px;
  color: ${theme.colors.text.primary};
`;

const PropertyList = styled.View`
  gap: 5px;
`;

const PropertyRow = styled.View`
  flex-direction: row;
  padding-vertical: 2px;
`;

const PropertyKey = styled.Text`
  font-size: ${theme.fontSize.md}px;
  font-weight: ${theme.fontWeight.medium};
  color: #555;
  min-width: 100px;
  margin-right: ${theme.spacing.md}px;
`;

const PropertyValue = styled.Text`
  font-size: ${theme.fontSize.md}px;
  color: ${theme.colors.text.primary};
  flex: 1;
`;

const NoProperties = styled.Text`
  font-size: ${theme.fontSize.md}px;
  color: #999;
  font-style: italic;
`;

const VectorInfo = styled.View`
  margin-top: ${theme.spacing.md}px;
  padding-top: ${theme.spacing.md}px;
  border-top-width: 1px;
  border-top-color: #f0f0f0;
`;

const VectorText = styled.Text`
  font-size: ${theme.fontSize.sm}px;
  color: ${theme.colors.text.secondary};
  font-style: italic;
`;

export default function ObjectCard({ object }: ObjectCardProps) {
  const renderProperty = (key: string, value: any): string => {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  const propertyKeys = Object.keys(object.properties);

  return (
    <Card>
      <ObjectHeader>
        <ObjectId>ID: {object.id}</ObjectId>
        <ObjectClass>Class: {object.class}</ObjectClass>
      </ObjectHeader>

      <PropertiesContainer>
        <PropertiesTitle>Properties:</PropertiesTitle>
        {propertyKeys.length > 0 ? (
          <PropertyList>
            {propertyKeys.map((key) => (
              <PropertyRow key={key}>
                <PropertyKey>{key}:</PropertyKey>
                <PropertyValue numberOfLines={3}>
                  {renderProperty(key, object.properties[key])}
                </PropertyValue>
              </PropertyRow>
            ))}
          </PropertyList>
        ) : (
          <NoProperties>No properties</NoProperties>
        )}
      </PropertiesContainer>

      {object.vector && (
        <VectorInfo>
          <VectorText>
            Vector: [{object.vector.length} dimensions]
          </VectorText>
        </VectorInfo>
      )}
    </Card>
  );
}


