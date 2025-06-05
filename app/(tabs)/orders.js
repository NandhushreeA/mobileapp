import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { order_list } from '../../src/services/productServices';
import { LinearGradient } from 'expo-linear-gradient';

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const customer_id = await AsyncStorage.getItem("Customer_id");
      const response = await order_list(customer_id);
      console.log("data for orders: ",response.data)
      const customerOrders = response.data;
      console.log("orders" ,JSON.stringify(customerOrders));
      if (customerOrders && customerOrders.length > 0) {
        setOrders(customerOrders);
      } else {
        setError("No orders found");
      }
    } catch (err) {
      setError("Failed to fetch orders");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading Orders...</Text>
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchOrders}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <LinearGradient
        colors={['#2563eb', '#1d4ed8']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <MaterialIcons name="receipt-long" size={32} color="#ffffff" />
          <Text style={styles.title}>Order History</Text>
        </View>
        <View style={styles.orderCount}>
          <Text style={styles.orderCountText}>{orders.length} Orders</Text>
        </View>
      </LinearGradient>

      {orders.map((order, index) => (
        <TouchableOpacity 
          key={order.id || index} 
          style={styles.orderCard}
          activeOpacity={0.3}
          onPress={() => toggleOrderExpansion(order.id)}
        >
          <View style={styles.orderHeader}>
            <View style={styles.orderIdContainer}>
              <Text style={styles.orderId}>Order #{order.id}</Text>
            </View>
            <Text style={styles.orderDate}>{order.customer_name || 'N/A'}</Text>
          </View>

          <View style={styles.orderDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Total Amount</Text>
              <Text style={styles.value}>₹{order.total || '0'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Invoice Date</Text>
              <Text style={styles.value}>{order.invoice_date || 'N/A'}</Text>
            </View>
          </View>

          {expandedOrderId === order.id && (
            <>
              <View style={styles.expandedDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Invoice Due Date</Text>
                  <Text style={styles.value}>{order.invoice_due_date || 'N/A'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Invoice Number</Text>
                  <Text style={styles.value}>{order.invoice_number || '0'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Outstanding Amount</Text>
                  <Text style={styles.value}>{order.outstanding_amt || '0'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Tax Amount</Text>
                  <Text style={styles.value}>₹{order.tax_amount || '0'}</Text>
                </View>
              </View>

              {/* Order Items Section */}
              {order.order_items && order.order_items.length > 0 && (
                <View style={styles.orderItemsContainer}>
                  <Text style={styles.orderItemsTitle}>Order Items</Text>
                  {order.order_items.map((item, itemIndex) => (
                    <View key={item.id || itemIndex} style={styles.orderItemCard}>
                      <View style={styles.orderItemHeader}>
                        <Text style={styles.orderItemName}>{item.product?.product_name || 'Item Name'}</Text>
                        <Text style={styles.orderItemQuantity}>Qty: {item.quantity || '0'}</Text>
                      </View>

                      <View style={styles.orderDetails}>
                        <View style={styles.detailRow}>
                          <Text style={styles.label}>Product Code</Text>
                          <Text style={styles.value}>{item.product?.product_code || 'N/A'}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.label}>Category</Text>
                          <Text style={styles.value}>{item.product?.category || 'N/A'}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.label}>Final Price</Text>
                          <Text style={styles.value}>₹{item.final_price || '0.00'}</Text>
                        </View>
                      </View>

                      {/* Product Variations */}
                      {item.product_variations && item.product_variations.length > 0 && (
                        <View style={styles.variationsContainer}>
                          <Text style={styles.variationsTitle}>Product Variations</Text>
                          {item.product_variations.map((variation, vIndex) => (
                            <View key={variation.id || vIndex} style={styles.variationItem}>
                              <View style={styles.variationHeader}>
                                <Text style={styles.variationName}>{variation.variation?.name || 'N/A'}</Text>
                                <Text style={styles.variationValue}>{variation.value || 'N/A'}</Text>
                              </View>
                              {variation.image && (
                                <Image 
                                  source={{ uri: variation.image }} 
                                  style={styles.variationImage}
                                  resizeMode="contain"
                                />
                              )}
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}

              {order.notes && (
                <View style={styles.notesContainer}>
                  <MaterialIcons name="note" size={16} color="#64748b" />
                  <Text style={styles.notesText}>{order.notes}</Text>
                </View>
              )}
            </>
          )}

          <View style={styles.expandIndicator}>
            <MaterialIcons 
              name={expandedOrderId === order.id ? "expand-less" : "expand-more"} 
              size={24} 
              color="#64748b" 
            />
          </View>
        </TouchableOpacity>
      ))}
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
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    backgroundColor:'#2cc978',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 12,
  },
  orderCount: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  orderCountText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    margin: 16,
    marginTop: 8,
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
  orderHeader: {
    marginBottom: 12,
  },
  orderIdContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontWeight: '600',
    fontSize: 14,
  },
  orderDate: {
    fontSize: 14,
    color: '#64748b',
  },
  orderDetails: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
  },
  orderItemsContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 16,
  },
  orderItemsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  orderItemCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  orderItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  orderItemQuantity: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  variationsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  variationsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  variationItem: {
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 6,
    marginBottom: 4,
  },
  variationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  variationName: {
    fontSize: 14,
    color: '#64748b',
  },
  variationValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  variationImage: {
    width: '100%',
    height: 100,
    borderRadius: 4,
    marginTop: 4,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  notesText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
  expandedDetails: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 12,
    marginTop: 12,
  },
  expandIndicator: {
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
});
