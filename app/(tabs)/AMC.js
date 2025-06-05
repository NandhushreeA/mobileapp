import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import warrantyData from '../../data.json'; // Updated import path

const App = () => {
  const { customerName, invoiceNumber, warrantyDetails } = warrantyData;

  const renderServiceItem = ({ item }) => (
    <View style={styles.serviceCard}>
      <View style={styles.serviceHeader}>
        <MaterialIcons 
          name={item.status === 'Completed' ? 'check-circle' : 'schedule'} 
          size={24} 
          color={item.status === 'Completed' ? '#16a34a' : '#f59e0b'} 
        />
        <Text style={styles.serviceDate}>{item.date}</Text>
      </View>
      <View style={styles.serviceDetails}>
        <Text style={styles.serviceType}>{item.type}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.status === 'Completed' ? '#dcfce7' : '#fef3c7' }
        ]}>
          <Text style={[
            styles.statusText,
            { color: item.status === 'Completed' ? '#16a34a' : '#f59e0b' }
          ]}>
            {item.status}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* AMC Details Heading */}
        <View style={styles.headerContainer}>
          <MaterialIcons name="assignment" size={32} color="#2563eb" />
          <Text style={styles.headerTitle}>AMC Details</Text>
        </View>

        {/* Customer Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="person" size={24} color="#2563eb" />
            <Text style={styles.cardTitle}>Customer Information</Text>
          </View>
          <Text style={styles.customerName}>{customerName}</Text>
          <Text style={styles.invoiceNumber}>Invoice #{invoiceNumber}</Text>
        </View>

        {/* Warranty Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="verified" size={24} color="#2563eb" />
            <Text style={styles.cardTitle}>Warranty Details</Text>
          </View>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Product</Text>
              <Text style={styles.detailValue}>{warrantyDetails.productName}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Model</Text>
              <Text style={styles.detailValue}>{warrantyDetails.modelNumber}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Status</Text>
              <View style={[styles.statusBadge, { backgroundColor: '#dcfce7' }]}>
                <Text style={[styles.statusText, { color: '#16a34a' }]}>
                  {warrantyDetails.status}
                </Text>
              </View>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Installation</Text>
              <Text style={styles.detailValue}>{warrantyDetails.installationDate}</Text>
            </View>
          </View>
          <View style={styles.warrantyPeriod}>
            <MaterialIcons name="date-range" size={20} color="#64748b" />
            <Text style={styles.warrantyText}>
              Warranty Period: {warrantyDetails.warrantyFromDate} → {warrantyDetails.warrantyDueDate}
            </Text>
          </View>
        </View>

        {/* Service History Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="history" size={24} color="#2563eb" />
            <Text style={styles.cardTitle}>Service History</Text>
          </View>
          <FlatList
            data={warrantyDetails.serviceHistory}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderServiceItem}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginLeft: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginLeft: 8,
  },
  customerName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  invoiceNumber: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 8,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  detailItem: {
    flex: 1,
    minWidth: '45%',
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  warrantyPeriod: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  warrantyText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 8,
  },
  serviceCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceDate: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 8,
  },
  serviceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceType: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default App;
