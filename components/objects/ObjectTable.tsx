import React from 'react';
import { styled } from 'styled-components/native';
import { WeaviateObject } from '../weaviate/WeaviateHttpClient';
import { theme } from '../../styles/theme';

interface ObjectTableProps {
  objects: WeaviateObject[];
  onObjectPress?: (object: WeaviateObject) => void;
}

// Styled Components
const Container = styled.View`
  flex: 1;
  min-height: 300px;
`;

const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing.xxl}px;
`;

const EmptyText = styled.Text`
  font-size: ${theme.fontSize.lg}px;
  color: ${theme.colors.text.secondary};
  text-align: center;
`;

const TableHeader = styled.View`
  margin-bottom: ${theme.spacing.lg}px;
`;

const TableTitle = styled.Text`
  font-size: ${theme.fontSize.xl}px;
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: 4px;
`;

const TableSubtitle = styled.Text`
  font-size: ${theme.fontSize.sm}px;
  color: ${theme.colors.text.secondary};
`;

const Table = styled.View`
  width: 100%;
`;

const TableBody = styled.ScrollView`
  flex: 1;
  min-height: 200px;
  max-height: 400px;
`;

const Row = styled.View<{ isHeader?: boolean; isEven?: boolean }>`
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: #e9ecef;
  min-height: 56px;
  background-color: ${({ isHeader, isEven }) => 
    isHeader ? 'transparent' : 
    isEven ? '#f8f9fa' : theme.colors.background
  };
`;

const Cell = styled.View<{ isHeader?: boolean }>`
  flex: 1;
  min-width: 80px;
  min-height: 40px;
  padding: ${theme.spacing.md}px;
  border-right-width: 1px;
  border-right-color: ${({ isHeader }) => isHeader ? '#495057' : '#dee2e6'};
  justify-content: center;
  background-color: ${({ isHeader }) => isHeader ? '#343a40' : 'transparent'};
`;

const CellText = styled.Text<{ isHeader?: boolean }>`
  font-size: ${({ isHeader }) => isHeader ? theme.fontSize.md : theme.fontSize.sm}px;
  font-weight: ${({ isHeader }) => isHeader ? theme.fontWeight.bold : theme.fontWeight.normal};
  color: ${({ isHeader }) => isHeader ? theme.colors.text.white : '#495057'};
  text-align: ${({ isHeader }) => isHeader ? 'center' : 'left'};
  line-height: 18px;
`;

const ObjectRow = styled.TouchableOpacity<{ isEven?: boolean }>`
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
  min-height: 56px;
  background-color: ${({ isEven }) => isEven ? theme.colors.background : '#fafafa'};
`;

export default function ObjectTable({ objects, onObjectPress }: ObjectTableProps) {
  if (objects.length === 0) {
    return (
      <EmptyContainer>
        <EmptyText>No objects to display</EmptyText>
      </EmptyContainer>
    );
  }

  // Get all unique property keys from all objects
  const allPropertyKeys = Array.from(
    new Set(
      objects.flatMap(obj => Object.keys(obj.properties))
    )
  ).sort();

  const renderCell = (content: any, isHeader = false) => {
    let displayContent = content;
    if (!isHeader) {
      if (content === null || content === undefined) {
        displayContent = '-';
      } else if (typeof content === 'object') {
        displayContent = JSON.stringify(content);
      } else {
        displayContent = String(content);
      }
    }

    return (
      <Cell isHeader={isHeader}>
        <CellText isHeader={isHeader} numberOfLines={isHeader ? 1 : 2}>
          {displayContent}
        </CellText>
      </Cell>
    );
  };

  const renderHeaderRow = () => (
    <Row isHeader>
      {renderCell('ID', true)}
      {renderCell('Class', true)}
      {allPropertyKeys.map(key => renderCell(key, true))}
      {renderCell('Vector', true)}
    </Row>
  );

  const renderObjectRow = (object: WeaviateObject, index: number) => (
    <ObjectRow
      key={object.id}
      isEven={index % 2 === 0}
      onPress={() => onObjectPress && onObjectPress(object)}
    >
      {renderCell(object.id.substring(0, 8) + '...')}
      {renderCell(object.class)}
      {allPropertyKeys.map(key => renderCell(object.properties[key]))}
      {renderCell(object.vector ? `[${object.vector.length}D]` : '-')}
    </ObjectRow>
  );

  return (
    <Container>
      <TableHeader>
        <TableTitle>Data Table</TableTitle>
        <TableSubtitle>
          Showing {objects.length} object{objects.length !== 1 ? 's' : ''} • All columns displayed
        </TableSubtitle>
      </TableHeader>

      <Table>
        {renderHeaderRow()}
        <TableBody nestedScrollEnabled={true}>
          {objects.map((object, index) => renderObjectRow(object, index))}
        </TableBody>
      </Table>
    </Container>
  );
}
