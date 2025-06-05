import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Switch } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { colors } from '../Styles/appStyle';
import { AppContext } from '../../context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRouter } from 'expo-router';
import { getProfileInfo } from '../services/authServices';
import ConfirmationModal from '../components/ConfirmationModal';
import HeaderComponent from './HeaderComponent';
import { customerDetail } from '../services/productServices';

const ProfileScreen = () => {
  const [profile, setprofile] = useState({});
  const { logout } = useContext(AppContext);
  const [userPin, setUserPin] = useState(null);
  const [profileImg, setProfileImg] = useState({});
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();

  const fetchCustomerDetails = useCallback(async () => {
    try {
      const customerId = await AsyncStorage.getItem('Customer_id');
      if (!customerId) {
        console.log('Customer ID not found in AsyncStorage');
        return;
      }

      const res = await customerDetail(customerId);
      if (!res || !res.data) {
        console.log('No data returned from customerDetail API');
        return;
      }

      // Handle both array and object responses
      const customerData = Array.isArray(res.data) ? res.data[0] : res.data;
      if (customerData) {
        setprofile(customerData);
      } else {
        console.log('No customer data found in response');
      }
    } catch (error) {
      console.error('Failed to fetch Customer Details:', error.message);
      console.error('Customer Detail Error Details:', error);
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedPin = await AsyncStorage.getItem('userPin');
        setUserPin(storedPin);

        const biometric = await AsyncStorage.getItem('userBiometric');
        setBiometricEnabled(biometric === 'true');
      } catch (error) {
        console.error('Error loading user data:', error.message);
      }
    };
    fetchUserData();
    fetchCustomerDetails();
  }, [fetchCustomerDetails]);

  useEffect(() => {
    const fetchProfileInfo = async () => {
      try {
        const res = await getProfileInfo();
        if (!res || !res.data) {
          console.log('No data returned from getProfileInfo API');
          return;
        }

        const profileData = res.data;
        if (profileData) {
          setProfileImg(profileData);
          setIsManager(profileData.user_group?.is_manager || false);
        } else {
          console.log('No profile data found in response');
        }
      } catch (error) {
        console.error('Error fetching profile info:', error.message);
        console.error('Profile Info Error Details:', error);
        // Set default values in case of error
        setProfileImg({});
        setIsManager(false);
      }
    };
    fetchProfileInfo();
  }, []);

  const handleBiometricToggle = async (value) => {
    try {
      setBiometricEnabled(value);
      if (value) {
        await AsyncStorage.setItem('userBiometric', 'true');
      } else {
        await AsyncStorage.removeItem('userBiometric');
      }
    } catch (error) {
      console.error('Error updating biometric setting:', error.message);
      setBiometricEnabled(!value);
    }
  };

  const handlePressPassword = () => {
    router.push({ pathname: 'ResetPassword' });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const formatAddress = () => {
    if (!profile) {
      return 'No address available';
    }
    if (profile.address_line_1 && profile.address_line_2) {
      return `${profile.address_line_1}, ${profile.address_line_2}`;
    } else if (profile.address_line_1) {
      return profile.address_line_1;
    } else if (profile.address_line_2) {
      return profile.address_line_2;
    }
    return 'No address available';
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderComponent
        headerTitle="Update Your PIN"
        onBackPress={() => router.back()}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileBanner}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: profileImg?.image || 'https://via.placeholder.com/100' }}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.profileName}>{profile.name || 'N/A'}</Text>
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{profile.customer_group || 'N/A'}</Text>
            </View>
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.contactCard}>
            <View style={styles.contactItem}>
              <View style={styles.iconContainer}>
                <MaterialIcons name="email" size={22} color={colors.primary} />
              </View>
              <View style={styles.contactDetails}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>{profile.email_id || 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.contactItem}>
              <View style={styles.iconContainer}>
                <MaterialIcons name="phone" size={22} color={colors.primary} />
              </View>
              <View style={styles.contactDetails}>
                <Text style={styles.contactLabel}>Phone</Text>
                <Text style={styles.contactValue}>{profile.mobile_number || 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.contactItem}>
              <View style={styles.iconContainer}>
                <MaterialIcons name="location-on" size={22} color={colors.primary} />
              </View>
              <View style={styles.contactDetails}>
                <Text style={styles.contactLabel}>Address</Text>
                <Text style={styles.contactValue}>{formatAddress()}</Text>
              </View>
            </View>
            {profile.contact_name && (
              <>
                <View style={styles.divider} />
                <View style={styles.contactItem}>
                  <View style={styles.iconContainer}>
                    <MaterialIcons name="person" size={22} color={colors.primary} />
                  </View>
                  <View style={styles.contactDetails}>
                    <Text style={styles.contactLabel}>Contact Person</Text>
                    <Text style={styles.contactValue}>{profile.contact_name}</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Account Options</Text>
          <View style={styles.optionsContainer}>
            <View style={styles.optionItem}>
              <View style={styles.optionIconContainer}>
                <MaterialIcons name="fingerprint" size={22} color={colors.primary} />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>Biometric Authentication</Text>
                <Text style={styles.optionDescription}>
                  Use fingerprint or face ID to log in
                </Text>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={handleBiometricToggle}
                trackColor={{ false: colors.muted, true: colors.primaryTransparent }}
                thumbColor={biometricEnabled ? colors.primary : colors.white}
              />
            </View>
            <View style={styles.optionDivider} />
            <TouchableOpacity style={styles.optionItem} onPress={handlePressPassword}>
              <View style={styles.optionIconContainer}>
                <MaterialIcons name="lock" size={22} color={colors.primary} />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>Update PIN</Text>
                <Text style={styles.optionDescription}>Set or change your security PIN</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.optionDivider} />
            <TouchableOpacity style={styles.optionItem} onPress={() => setIsLogoutModalVisible(true)}>
              <View style={[styles.optionIconContainer, { backgroundColor: colors.errorTransparent }]}>
                <MaterialIcons name="logout" size={22} color={colors.error} />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionText, { color: colors.error }]}>Logout</Text>
                <Text style={styles.optionDescription}>Sign out from your account</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <ConfirmationModal
        visible={isLogoutModalVisible}
        message="Are you sure you want to logout?"
        onConfirm={() => {
          setIsLogoutModalVisible(false);
          logout();
        }}
        onCancel={() => setIsLogoutModalVisible(false)}
        confirmText="Logout"
        cancelText="Cancel"
      />
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
    paddingBottom: 32,
  },
  profileBanner: {
    backgroundColor: colors.background,
    paddingTop: 24,
    paddingBottom: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.muted,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.white,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 12,
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
  },
  badge: {
    backgroundColor: colors.primaryTransparent,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  badgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  sectionContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  contactCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryTransparent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactDetails: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.muted,
    marginLeft: 64,
  },
  optionsContainer: {
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingVertical: 8,
    marginBottom: 8,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryTransparent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  optionDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  optionDivider: {
    height: 1,
    backgroundColor: colors.muted,
    marginLeft: 68,
  },
});

export default ProfileScreen;