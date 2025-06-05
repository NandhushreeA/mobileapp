import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../src/Styles/appStyle';
import HeaderComponent from '../../src/screens/HeaderComponent';
import { useRouter } from 'expo-router';
import { submitCustomerTicket } from '../../src/services/productServices';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RaiseTicket = () => {
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium'); // low, medium, high
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!subject.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const customer_id = await AsyncStorage.getItem('Customer_id');
      if (!customer_id) {
        throw new Error('Customer ID not found. Cannot submit ticket.');
      }

      const formData = new FormData();
      formData.append('cust_id', customer_id);
      formData.append('Call_mode', 'TICKET_UPDATE');
      formData.append('remarks', formState.description.trim());
      formData.append('task_id', RaiseTicket.id.toString());
      // You might need to append other fields like 'call_mode' or 'task_id' if required by the API
      // based on the image, 'call_mode' and 'task_id' are appended for 'TICKET_UPDATE'.
      // For creating a new ticket, these might be different or not needed.
      // Let's start with the essential fields and add more if the API requires.


      const response = await submitCustomerTicket(formData);

      if (response.data.success) {
        Alert.alert(
          'Success',
          'Your ticket has been submitted successfully',
          [
            {
              text: 'OK',
              onPress: () => router.back()
            }
          ]
        );
      } else {
        // Assuming the API returns a message in case of failure
        const errorMessage = response.data.message || response.data.error || 'Failed to submit ticket';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Ticket submission error:', error);
      Alert.alert('Error', error.message || 'Failed to submit ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderComponent
        headerTitle="Raise a Ticket"
        onBackPress={() => router.back()}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          {/* Subject Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Subject *</Text>
            <TextInput
              style={styles.input}
              value={subject}
              onChangeText={setSubject}
              placeholder="Brief description of the issue"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          {/* Description Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Please provide detailed information about your issue"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          {/* Priority Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityContainer}>
              {['low', 'medium', 'high'].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.priorityButton,
                    priority === level && styles.priorityButtonActive,
                    { backgroundColor: priority === level ? colors.primary : colors.background }
                  ]}
                  onPress={() => setPriority(level)}
                >
                  <Text
                    style={[
                      styles.priorityButtonText,
                      { color: priority === level ? colors.white : colors.textPrimary }
                    ]}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <Text style={styles.submitButtonText}>Submitting...</Text>
            ) : (
              <Text style={styles.submitButtonText}>Submit Ticket</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  formContainer: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.muted,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.textPrimary,
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.muted,
  },
  priorityButtonActive: {
    borderColor: colors.primary,
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RaiseTicket; 