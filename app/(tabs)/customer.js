import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { customerDetail, } from '../../src/services/productServices';

export default function CustomerScreen() {
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomerData = async () => {
    try {
      const customer_id = await AsyncStorage.getItem("Customer_id");
      const response = await customerDetail();
      const data = response.data?.find(item => item.id?.toString() === customer_id?.toString());
      console.log(data);
      if (data) {
        setCustomerData(data)
      } else {
        setError("No customer data found");
      }
    } catch (err) {
      setError("Failed to fetch customer data");
      console.error("Error fetching customer data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading Customer Data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchCustomerData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialIcons name="person" size={32} color="#2563eb" />
          <Text style={styles.title}>Customer Details</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>Active</Text>
        </View>
      </View>

      {customerData && (
        <View style={styles.dataContainer}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="person-outline" size={24} color="#2563eb" />
              <Text style={styles.cardTitle}>Personal Information</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{customerData.contact_name || 'Not Available'}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{customerData.email_id || 'Not Available'}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.value}>{customerData.mobile_number || 'Not Available'}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="location-on" size={24} color="#2563eb" />
              <Text style={styles.cardTitle}>Address Information</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.label}>Address</Text>
              <Text style={styles.value}>{customerData.address_line_1 || 'Not Available'}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="business" size={24} color="#2563eb" />
              <Text style={styles.cardTitle}>Account Information</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.label}>Customer ID</Text>
              <Text style={styles.value}>{customerData.id || 'Not Available'}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.label}>Product interest</Text>
              <View style={styles.orderBadge}>
                <Text style={styles.orderBadgeText}>{customerData.no_of_pi || '0'}</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#ef4444',
    fontWeight: '500',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginLeft: 12,
  },
  statusBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#16a34a',
    fontWeight: '600',
    fontSize: 14,
  },
  dataContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
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
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginLeft: 8,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  label: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
    marginLeft: 16,
  },
  orderBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  orderBadgeText: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 14,
  },
}); 