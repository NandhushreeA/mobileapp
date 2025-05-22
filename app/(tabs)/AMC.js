import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function AMCDetailsScreen() {
  const [selectedSection, setSelectedSection] = useState(null);

  // Static AMC data
  const amcDetails = {
    nextScheduledDate: '2025-08-15',
    warrantyStatus: 'Active',
    renewalDetails: {
      startDate: '2025-09-01',
      endDate: '2026-08-31',
      productname: 'Solar panel',
    },
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? '#10B981' : '#EF4444';
  };

  const getStatusIcon = (status) => {
    return status === 'Active' ? 'check-circle' : 'error';
  };

  const renderSection = (title, content, icon, sectionKey) => {
    const isSelected = selectedSection === sectionKey;

    return (
      <TouchableOpacity
        onPress={() => setSelectedSection(isSelected ? null : sectionKey)}
        style={styles.section}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={['#ffffff', '#f8fafc']}
          style={styles.sectionGradient}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <MaterialIcons name={icon} size={24} color="#2563eb" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>{title}</Text>
            </View>
            <MaterialIcons
              name={isSelected ? 'expand-less' : 'expand-more'}
              size={24}
              color="#64748b"
            />
          </View>
          
          {isSelected && (
            <View style={styles.sectionContent}>
              {content}
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#2563eb', '#1d4ed8']}
        style={styles.header}
      >
        <Text style={styles.title}>AMC Details</Text>
        <View style={styles.statusContainer}>
          <MaterialIcons
            name={getStatusIcon(amcDetails.warrantyStatus)}
            size={24}
            color={getStatusColor(amcDetails.warrantyStatus)}
          />
          <Text style={[styles.statusText, { color: getStatusColor(amcDetails.warrantyStatus) }]}>
            {amcDetails.warrantyStatus}
          </Text>
        </View>
      </LinearGradient>

      {renderSection(
        'Next Scheduled AMC',
        <View style={styles.detailContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{amcDetails.nextScheduledDate}</Text>
          </View>
        </View>,
        'event',
        'nextScheduled'
      )}

      {renderSection(
        'Renewal Details',
        <View style={styles.detailContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Start Date</Text>
            <Text style={styles.detailValue}>{amcDetails.renewalDetails.startDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>End Date</Text>
            <Text style={styles.detailValue}>{amcDetails.renewalDetails.endDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Product</Text>
            <Text style={styles.detailValue}>{amcDetails.renewalDetails.productname}</Text>
          </View>
        </View>,
        'update',
        'renewal'
      )}
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 24,
    paddingTop: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sectionGradient: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  sectionContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  detailContainer: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600',
  },
});
