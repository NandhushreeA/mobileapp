import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { order_list } from '../../src/services/productServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { colors } from '../../src/Styles/appStyle';

const HomeScreen = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderCount, setOrderCount] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [systemData, setSystemData] = useState({
    energyProduction: {
      today: '45.2 kWh',
      monthly: '1,250 kWh',
      total: '15,750 kWh'
    },
    systemStatus: {
      status: 'Active',
      lastMaintenance: '2024-03-01',
      nextMaintenance: '2024-06-01'
    },
    alerts: [
      {
        type: 'maintenance',
        message: 'Scheduled maintenance due in 15 days',
        priority: 'medium'
      },
      {
        type: 'performance',
        message: 'System performing at 95% efficiency',
        priority: 'low'
      }
    ]
  });
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const customer_id = await AsyncStorage.getItem("Customer_id");
      const name = await AsyncStorage.getItem("customerName");
      setCustomerName(name || 'Customer');
      
      if (customer_id) {
        const ordersRes = await order_list(customer_id);
        if (ordersRes && ordersRes.data) {
          setOrderCount(ordersRes.data.length || 0);
          if (ordersRes.data.length > 0) {
            setCustomerName(ordersRes.data[0].customer_name || 'Customer');
          }
        }
      }
    } catch (err) {
      setError("Failed to fetch data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <View style={styles.welcomeHeader}>
          <MaterialIcons name="home" size={32} color="#2563eb" />
          <Text style={styles.welcomeTitle}>Welcome </Text>
        </View>
        <Text style={styles.welcomeSubtitle}>Hello, {customerName}</Text>
        <Text style={styles.welcomeText}>Here's an overview of your solar system</Text>
      </View>

      {/* System Status Card */}
      <View style={styles.statsContainer}>
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <MaterialIcons name="solar-power" size={24} color="#2563eb" />
            <Text style={styles.statusTitle}>System Status</Text>
          </View>
          <View style={styles.statusContent}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Current Status:</Text>
              <View style={[styles.statusBadge, { backgroundColor: '#dcfce7' }]}>
                <Text style={[styles.statusText, { color: '#16a34a' }]}>
                  {systemData.systemStatus.status}
                </Text>
              </View>
            </View>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Last Maintenance:</Text>
              <Text style={styles.statusValue}>{systemData.systemStatus.lastMaintenance}</Text>
            </View>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Next Maintenance:</Text>
              <Text style={styles.statusValue}>{systemData.systemStatus.nextMaintenance}</Text>
            </View>
          </View>
        </View>

        {/* Support Card */}
        <View style={[styles.statusCard, { marginTop: 16 }]}>
          <View style={styles.statusHeader}>
            <MaterialIcons name="support-agent" size={24} color="#2563eb" />
            <Text style={styles.statusTitle}>Need Help?</Text>
          </View>
          <View style={styles.statusContent}>
            <Text style={styles.supportText}>
              Having issues with your solar system? Our support team is here to help.
            </Text>
            <TouchableOpacity
              style={styles.supportButton}
              onPress={() => router.push('/RaiseTicket')}
            >
              <Text style={styles.supportButtonText}>Raise a Ticket</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Energy Production Cards */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Energy Production</Text>
        <View style={styles.energyGrid}>
          <View style={styles.energyCard}>
            <MaterialIcons name="wb-sunny" size={24} color="#f59e0b" />
            <Text style={styles.energyValue}>{systemData.energyProduction.today}</Text>
            <Text style={styles.energyLabel}>Today</Text>
          </View>
          <View style={styles.energyCard}>
            <MaterialIcons name="calendar-today" size={24} color="#2563eb" />
            <Text style={styles.energyValue}>{systemData.energyProduction.monthly}</Text>
            <Text style={styles.energyLabel}>This Month</Text>
          </View>
          <View style={styles.energyCard}>
            <MaterialIcons name="trending-up" size={24} color="#16a34a" />
            <Text style={styles.energyValue}>{systemData.energyProduction.total}</Text>
            <Text style={styles.energyLabel}>Total</Text>
          </View>
        </View>
      </View>

      {/* Alerts Section */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>System Alerts</Text>
        {systemData.alerts.map((alert, index) => (
          <View key={index} style={styles.alertCard}>
            <MaterialIcons 
              name={alert.type === 'maintenance' ? 'build' : 'trending-up'} 
              size={24} 
              color={alert.priority === 'medium' ? '#f59e0b' : '#16a34a'} 
            />
            <View style={styles.alertContent}>
              <Text style={styles.alertMessage}>{alert.message}</Text>
              <Text style={[
                styles.alertPriority,
                { color: alert.priority === 'medium' ? '#f59e0b' : '#16a34a' }
              ]}>
                {alert.priority === 'medium' ? 'Medium Priority' : 'Low Priority'}
              </Text>
            </View>
          </View>
        ))}
      </View>

   

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
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#ef4444',
    fontWeight: '500',
  },
  welcomeSection: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginLeft: 12,
  },
  welcomeSubtitle: {
    fontSize: 20,
    color: '#64748b',
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 16,
    color: '#94a3b8',
  },
  statsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  statusCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginLeft: 8,
  },
  statusContent: {
    gap: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  statusValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600',
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
  energyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  energyCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  energyValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginVertical: 8,
  },
  energyLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertContent: {
    marginLeft: 12,
    flex: 1,
  },
  alertMessage: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  alertPriority: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  orderCard: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderCount: {
    fontSize: 48,
    fontWeight: '700',
    color: '#2563eb',
    marginVertical: 12,
  },
  orderLabel: {
    fontSize: 18,
    color: '#64748b',
    fontWeight: '500',
  },
  supportText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  supportButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  supportButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
