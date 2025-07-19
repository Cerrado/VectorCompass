import React, { JSX } from 'react';
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../../styles/theme';
import { Button, ButtonText } from '../../styles/components';

interface CollectionPropertiesProps {
  show: boolean;
  collectionName: string;
  collectionSchema: any;
  loadingSchema: boolean;
  onClose: () => void;
}

// Styled Components
const PropertiesSection = styled.View`
  margin-bottom: ${theme.spacing.xl}px;
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.lg}px;
  ${theme.shadows.small};
`;

const PropertiesSectionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.lg}px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
  background-color: ${theme.colors.surface};
  border-top-left-radius: ${theme.borderRadius.lg}px;
  border-top-right-radius: ${theme.borderRadius.lg}px;
`;

const PropertiesTitle = styled.Text`
  font-size: ${theme.fontSize.xl}px;
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.text.primary};
`;

const SchemaLoadingState = styled.View`
  padding: ${theme.spacing.xxl}px;
  align-items: center;
`;

const LoadingText = styled.Text`
  margin-top: ${theme.spacing.md}px;
  font-size: ${theme.fontSize.lg}px;
  color: ${theme.colors.text.secondary};
`;

const SchemaContainer = styled.ScrollView`
  max-height: 400px;
  padding: ${theme.spacing.lg}px;
`;

const PropertiesList = styled.View`
  margin-bottom: ${theme.spacing.lg}px;
`;

const PropertyItem = styled.View<{ level?: number }>`
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md}px;
  padding: ${theme.spacing.md}px;
  border-left-width: 3px;
  border-left-color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.md}px;
  margin-left: ${({ level = 0 }) => level * 20}px;
`;

const PropertyHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const PropertyName = styled.Text`
  font-size: ${theme.fontSize.lg}px;
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.text.primary};
`;

const PropertyType = styled.View<{ dataType: string }>`
  background-color: ${({ dataType }) => {
    switch (dataType) {
      case 'text': return '#e3f2fd';
      case 'int': return '#f3e5f5';
      case 'number': return '#e8f5e8';
      case 'boolean': return '#fff3e0';
      case 'object': return '#fce4ec';
      default: return theme.colors.surface;
    }
  }};
  padding: 4px 8px;
  border-radius: ${theme.borderRadius.sm}px;
`;

const PropertyTypeText = styled.Text<{ dataType: string }>`
  font-size: ${theme.fontSize.sm}px;
  font-weight: ${theme.fontWeight.medium};
  color: ${({ dataType }) => {
    switch (dataType) {
      case 'text': return '#1976d2';
      case 'int': return '#7b1fa2';
      case 'number': return '#388e3c';
      case 'boolean': return '#f57c00';
      case 'object': return '#c2185b';
      default: return theme.colors.text.secondary;
    }
  }};
`;

const PropertyDetails = styled.View`
  margin-left: ${theme.spacing.lg}px;
`;

const PropertyDescription = styled.Text`
  font-size: ${theme.fontSize.sm}px;
  color: ${theme.colors.text.secondary};
  margin-bottom: 4px;
`;

const NestedPropertiesContainer = styled.View`
  margin-top: ${theme.spacing.md}px;
  padding-top: ${theme.spacing.md}px;
  border-top-width: 1px;
  border-top-color: #e9ecef;
  background-color: ${theme.colors.surface};
  border-radius: 6px;
  padding: ${theme.spacing.sm}px;
`;

const VectorizerInfo = styled.View`
  margin-top: ${theme.spacing.lg}px;
  padding: ${theme.spacing.md}px;
  background-color: #e7f3ff;
  border-radius: ${theme.borderRadius.md}px;
  border-left-width: 3px;
  border-left-color: ${theme.colors.primary};
`;

const VectorizerTitle = styled.Text`
  font-size: ${theme.fontSize.lg}px;
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: 4px;
`;

const VectorizerDetails = styled.Text`
  font-size: ${theme.fontSize.sm}px;
  color: ${theme.colors.text.secondary};
`;

const NestedPropertiesTitle = styled.Text`
  font-size: ${theme.fontSize.md}px;
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.sm}px;
`;

const PropertyDetail = styled.Text`
  font-size: ${theme.fontSize.sm}px;
  color: ${theme.colors.text.secondary};
`;

const NoPropertiesText = styled.Text`
  font-size: ${theme.fontSize.sm}px;
  color: ${theme.colors.text.secondary};
  font-style: italic;
`;

const SchemaTitle = styled.Text`
  font-size: ${theme.fontSize.xl}px;
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.lg}px;
`;

const SchemaErrorText = styled.Text`
  font-size: ${theme.fontSize.lg}px;
  color: ${theme.colors.destructive};
`;

export default function CollectionProperties({
  show,
  collectionName,
  collectionSchema,
  loadingSchema,
  onClose,
}: CollectionPropertiesProps) {
  const renderNestedProperties = (properties: any[], level: number = 0): JSX.Element[] => {
    return properties.map((property: any, index: number) => {
      const dataType = property.dataType?.[0] || 'unknown';
      const isObjectType = dataType === 'object' || dataType === 'object[]';

      return (
        <PropertyItem key={`${level}-${index}`} level={level}>
          <PropertyHeader>
            <PropertyName>
              {level > 0 && '└─ '}{property.name}
            </PropertyName>
            <PropertyType dataType={dataType}>
              <PropertyTypeText dataType={dataType}>
                {dataType}
              </PropertyTypeText>
            </PropertyType>
          </PropertyHeader>

          {property.description && (
            <PropertyDescription>{property.description}</PropertyDescription>
          )}

          <PropertyDetails>
            {property.tokenization && (
              <PropertyDetail>Tokenization: {property.tokenization}</PropertyDetail>
            )}
            {property.indexFilterable !== undefined && (
              <PropertyDetail>
                Filterable: {property.indexFilterable ? 'Yes' : 'No'}
              </PropertyDetail>
            )}
            {property.indexSearchable !== undefined && (
              <PropertyDetail>
                Searchable: {property.indexSearchable ? 'Yes' : 'No'}
              </PropertyDetail>
            )}
          </PropertyDetails>

          {isObjectType && (property.nestedProperties || property.properties) && (
            <NestedPropertiesContainer>
              <NestedPropertiesTitle>Nested Properties:</NestedPropertiesTitle>
              {property.nestedProperties && property.nestedProperties.length > 0 
                ? renderNestedProperties(property.nestedProperties, level + 1)
                : property.properties && property.properties.length > 0
                ? renderNestedProperties(property.properties, level + 1)
                : <NoPropertiesText>No nested properties defined</NoPropertiesText>
              }
            </NestedPropertiesContainer>
          )}
        </PropertyItem>
      );
    });
  };

  if (!show || !collectionName) {
    return null;
  }

  return (
    <PropertiesSection>
      <PropertiesSectionHeader>
        <PropertiesTitle>
          Collection Properties: &quot;{collectionName}&quot;
        </PropertiesTitle>
        <Button
          variant="secondary"
          size="sm"
          onPress={onClose}
        >
          <ButtonText variant="secondary" size="sm">✕</ButtonText>
        </Button>
      </PropertiesSectionHeader>

      {loadingSchema ? (
        <SchemaLoadingState>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <LoadingText>Loading schema...</LoadingText>
        </SchemaLoadingState>
      ) : collectionSchema ? (
        <SchemaContainer showsVerticalScrollIndicator={true}>
          <SchemaTitle>Schema Information</SchemaTitle>

          {collectionSchema.properties && collectionSchema.properties.length > 0 ? (
            <PropertiesList>
              {renderNestedProperties(collectionSchema.properties)}
            </PropertiesList>
          ) : (
            <NoPropertiesText>No properties found in schema</NoPropertiesText>
          )}

          {collectionSchema.vectorizer && (
            <VectorizerInfo>
              <VectorizerTitle>Vectorizer</VectorizerTitle>
              <VectorizerDetails>{collectionSchema.vectorizer}</VectorizerDetails>
            </VectorizerInfo>
          )}
        </SchemaContainer>
      ) : (
        <SchemaLoadingState>
          <SchemaErrorText>Failed to load schema</SchemaErrorText>
        </SchemaLoadingState>
      )}
    </PropertiesSection>
  );
}


