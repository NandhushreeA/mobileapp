import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../src/Styles/appStyle';
import HeaderComponent from '../../src/screens/HeaderComponent';
import { useRouter } from 'expo-router';
import { category_list } from '../../src/services/productServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from 'react-native-paper';

const RaiseTicket = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      // Get ALL data
      const allData = await AsyncStorage.getItem('ALL');
      if (!allData) {
        throw new Error('Customer data not found');
      }

      const parsedData = JSON.parse(allData);
      const customer_id = parsedData?.customer_id;
      
      if (!customer_id) {
        throw new Error('Customer ID not found in data');
      }

      // Call category_list with both ALL data and customer_id
      const response = await category_list("ALL", customer_id);
      console.log('Categories response:', response.data);
      if (response.data) {
        setCategories(response.data || []);
      } else {
        throw new Error(response.data.message || 'Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error.message);
      Alert.alert('Error', error.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCategories();
  };

  const renderCategoryItem = ({ item }) => (
    <Card style={styles.categoryCard}>
      <Card.Content>
        <Text style={styles.name}>{item.name}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderComponent
        headerTitle="Raise a Ticket"
        onBackPress={() => router.back()}
      />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading categories...</Text>
        </View>
      ) : error ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="error" size={48} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : categories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="category" size={48} color={colors.textSecondary} />
          <Text style={styles.emptyText}>No categories available</Text>
        </View>
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.parent_type_}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
  },
  categoryCard: {
    marginBottom: 12,
    backgroundColor: colors.background,
  },
  categoryName: {
    fontSize: 16,
    color: colors.textPrimary,
  },
});

export default RaiseTicket;
