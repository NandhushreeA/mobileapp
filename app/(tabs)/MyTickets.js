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
import { ticket_list } from '../../src/services/productServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from 'react-native-paper';

const MyTickets = () => {
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTickets = async () => {
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

      // Call ticket_list with both ALL data and customer_id
      const response = await ticket_list("ALL", customer_id);
      console.log('Tickets response:',response.data);
      if (response.data) {
        setTickets(response.data || []);
      } else {
        throw new Error(response.data.message || 'Failed to fetch tickets');
      }
    } catch (error) {
      console.error('Error fetching tickets:', error.message);
      Alert.alert('Error', error.message || 'Failed to fetch tickets');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTickets();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Waiting for Response':
      case 'On Hold':
      case 'In Progress':
      case 'Not Planned':
        return {
          bg: '#FFF3E0',
          text: '#FF9800'
        };
      case 'Closed-Not Successful':
      case 'Deleted':
        return {
          bg: '#FFEBEE',
          text: '#F44336'
        };
      default:
        return {
          bg: '#E8F5E9',
          text: '#4CAF50'
        };
    }
  };

  const TicketCard = ({ ticket }) => {
    const statusColors = getStatusColor(ticket.task_status);
    
    return (
      <Card>
        <Card.Content>
          <View style={styles.ticketHeader}>
            <Text style={styles.ticketId}>{ticket.task_ref_id}</Text>
            <View style={[
              styles.statusBox,
              { backgroundColor: statusColors.bg }
            ]}>
              <Text style={[
                styles.statusText,
                { color: statusColors.text }
              ]}>
                {ticket.task_status}
              </Text>
            </View>
          </View>
          
          <View style={styles.ticketInfo}>
            <Text style={styles.label}>Contact Name:</Text>
            <Text style={styles.value}>{ticket.contact_name}</Text>
          </View>

          <View style={styles.ticketInfo}>
            <Text style={styles.label}>Assigned To:</Text>
            <Text style={styles.value}>{ticket.emp_assigned || 'Not Assigned'}</Text>
          </View>

          <View style={styles.ticketInfo}>
            <Text style={styles.label}>Priority:</Text>
            <Text style={styles.value}>{ticket.priority}</Text>
          </View>

          <View style={styles.ticketInfo}>
            <Text style={styles.label}>Category:</Text>
            <Text style={styles.value}>{ticket.task_category_name}</Text>
          </View>

          <View style={styles.ticketInfo}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{ticket.task_date}</Text>
          </View>

          <View style={styles.ticketInfo}>
            <Text style={styles.label}>Remarks:</Text>
            <Text style={styles.value}>{ticket.remarks}</Text>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderTicketItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.ticketCard}
      onPress={() => {
        // router.push(`/ticket-details/${item.id}`);
      }}>
        
      <TicketCard ticket={item} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <HeaderComponent
        headerTitle="My Tickets"
        onBackPress={() => router.back()}/>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading tickets...</Text>
        </View>
      ) : tickets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="event-busy" size={48} color={colors.textSecondary} />
          <Text style={styles.emptyText}>No tickets found</Text>
        </View>
      ) : (
        <FlatList
          data={tickets}
          renderItem={renderTicketItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
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
  listContainer: {
    padding: 16,
  },
  ticketCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  ticketId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBox: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  ticketInfo: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
    width: 100,
  },
  value: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
    marginBottom: 24,
  },
  raiseTicketButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  raiseTicketText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MyTickets;