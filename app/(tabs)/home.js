import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [inventoryData, setInventoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log('Component mounted');
    const mockInventory = {
      inverter_model: 'Luminous Zelio+ 1100',
      battery_type: 'Tubular Battery',
      battery_capacity: '10kWh',
      solar_panel_zzz: 'PAN003',
      solar_panel_capacity: '320W x 2',
      warranty_status: '2026-03-15',
    };

    // Set data immediately
    setInventoryData(mockInventory);
    setLoading(false);
    
    // Start fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const getStatusColor = (key) => {
    switch(key) {
      case 'warranty_status':
        return '#16a34a';
      case 'battery_capacity':
        return '#2563eb';
      default:
        return '#64748b';
    }
  };

  const getIcon = (key) => {
    switch(key) {
      case 'inverter_model':
        return 'power';
      case 'battery_type':
        return 'battery-charging-full';
      case 'battery_capacity':
        return 'battery-full';
      case 'solar_panel_zzz':
        return 'solar-power';
      case 'solar_panel_capacity':
        return 'brightness-high';
      case 'warranty_status':
        return 'verified';
      default:
        return 'info';
    }
  };

  const getItemDetails = (key, value) => {
    switch(key) {
      case 'inverter_model':
        return {
          title: 'Inverter Details',
          details: [
            'UPS Mode Available',
            'LCD Display',
          ]
        };
      case 'battery_type':
        return {
          title: 'Battery Specifications',
          details: [
            '60kw capacity',
            '24 hours discharge',
            'Deep Discharge Protection'
          ]
        };
      case 'battery_capacity':
        return {
          title: 'Battery Capacity Info',
          details: [
            'Backup Time: ~4-5 hours',
            'Suitable for Home Use',
            'Fast Charging Support'
          ]
        };
      case 'solar_panel_zzz':
        return {
          title: 'Panel Information',
          details: [
            'High Efficiency Cells',
            'Anti-reflective Coating',
            'Weather Resistant'
          ]
        };
      case 'solar_panel_capacity':
        return {
          title: 'Panel Specifications',
          details: [
            'Total Output: 640W',
            'Efficiency: 21%',
            'Temperature Coefficient: -0.35%/°C'
          ]
        };
      case 'warranty_status':
        return {
          title: 'Warranty Information',
          details: [
            'Valid until: 2026-03-15',
            'Covers Manufacturing Defects',
            'Free Service Support',
          ]
        };
      default:
        return {
          title: 'Status',
          details: ['No additional information available']
        };
    }
  };

  console.log('Current state:', { loading, inventoryData, selectedItem });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading Inventory Data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <View style={styles.titleContainer}>
          <MaterialIcons name="inventory" size={32} color="#2563eb" />
          <Text style={styles.title}>Inventory Details</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>Active</Text>
        </View>
      </Animated.View>
      
      {inventoryData && Object.keys(inventoryData).length > 0 ? (
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          {Object.entries(inventoryData).map(([key, value]) => {
            const itemDetails = getItemDetails(key, value);
            return (
              <TouchableOpacity 
                key={key} 
                style={[
                  styles.itemRow,
                  selectedItem === key && styles.selectedItem
                ]}
                onPress={() => setSelectedItem(selectedItem === key ? null : key)}
              >
                <View style={styles.itemHeader}>
                  <MaterialIcons 
                    name={getIcon(key)} 
                    size={24} 
                    color={getStatusColor(key)} 
                    style={styles.itemIcon}
                  />
                  <Text style={styles.label}>
                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Text>
                </View>
                <Text style={[styles.value, { color: getStatusColor(key) }]}>{value}</Text>
                {selectedItem === key && (
                  <View style={styles.detailsContainer}>
                    <Text style={styles.detailsTitle}>{itemDetails.title}</Text>
                    {itemDetails.details.map((detail, index) => (
                      <View key={index} style={styles.detailRow}>
                        <MaterialIcons name="check-circle" size={16} color="#16a34a" style={styles.detailIcon} />
                        <Text style={styles.detailsText}>{detail}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      ) : (
        <View style={styles.noDataContainer}>
          <MaterialIcons name="error-outline" size={48} color="#64748b" />
          <Text style={styles.noData}>No inventory data available</Text>
        </View>
      )}
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    letterSpacing: 0.5,
  },
  statusBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#16a34a',
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  itemRow: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 16,
  },
  selectedItem: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemIcon: {
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 32,
  },
  detailsContainer: {
    marginTop: 12,
    marginLeft: 32,
    padding: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailIcon: {
    marginRight: 8,
  },
  detailsText: {
    fontSize: 14,
    color: '#475569',
    flex: 1,
  },
  noDataContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  noData: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 12,
  },
});
