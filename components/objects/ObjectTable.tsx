import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { WeaviateObject } from '../weaviate/WeaviateHttpClient';

interface ObjectTableProps {
  objects: WeaviateObject[];
  onObjectPress?: (object: WeaviateObject) => void;
}

export default function ObjectTable({ objects, onObjectPress }: ObjectTableProps) {
  if (objects.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No objects to display</Text>
      </View>
    );
  }

  // Get all unique property keys from all objects
  const allPropertyKeys = Array.from(
    new Set(
      objects.flatMap(obj => Object.keys(obj.properties))
    )
  ).sort();

  const renderCell = (content: any, isHeader = false) => {
    const cellStyle = isHeader ? styles.headerCell : styles.cell;
    const textStyle = isHeader ? styles.headerText : styles.cellText;
    
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
      <View style={cellStyle}>
        <Text style={textStyle} numberOfLines={isHeader ? 1 : 2}>
          {displayContent}
        </Text>
      </View>
    );
  };

  const renderHeaderRow = () => (
    <View style={styles.row}>
      {renderCell('ID', true)}
      {renderCell('Class', true)}
      {allPropertyKeys.map(key => renderCell(key, true))}
      {renderCell('Vector', true)}
    </View>
  );

  const renderObjectRow = (object: WeaviateObject, index: number) => (
    <TouchableOpacity
      key={object.id}
      style={[styles.row, index % 2 === 0 ? styles.evenRow : styles.oddRow]}
      onPress={() => onObjectPress && onObjectPress(object)}
    >
      {renderCell(object.id.substring(0, 8) + '...')}
      {renderCell(object.class)}
      {allPropertyKeys.map(key => renderCell(object.properties[key]))}
      {renderCell(object.vector ? `[${object.vector.length}D]` : '-')}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tableHeader}>
        <Text style={styles.tableTitle}>Data Table</Text>
        <Text style={styles.tableSubtitle}>
          Showing {objects.length} object{objects.length !== 1 ? 's' : ''} • Scroll horizontally to view all columns
        </Text>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.horizontalScroll}>
        <View style={styles.table}>
          {renderHeaderRow()}
          <ScrollView style={styles.tableBody} nestedScrollEnabled={true}>
            {objects.map((object, index) => renderObjectRow(object, index))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tableHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#f8f9fa',
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  tableSubtitle: {
    fontSize: 14,
    color: '#6c757d',
  },
  horizontalScroll: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
  table: {
    minWidth: '100%',
  },
  tableBody: {
    maxHeight: 400,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    minHeight: 56,
  },
  evenRow: {
    backgroundColor: '#f8f9fa',
  },
  oddRow: {
    backgroundColor: '#fff',
  },
  headerCell: {
    width: 140,
    padding: 12,
    backgroundColor: '#343a40',
    borderRightWidth: 1,
    borderRightColor: '#495057',
    justifyContent: 'center',
  },
  cell: {
    width: 140,
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: '#dee2e6',
    justifyContent: 'center',
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  cellText: {
    color: '#495057',
    fontSize: 13,
    textAlign: 'left',
    lineHeight: 18,
  },
});
