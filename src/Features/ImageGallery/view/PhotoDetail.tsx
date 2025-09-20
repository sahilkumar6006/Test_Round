import React, { useMemo, useState } from 'react';
import { Image, Dimensions, StyleSheet, Text, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
import CustomInput from '../../../components/CutomInput';
import { validate } from '../../../utils/validate';
import { submitData } from '../../../api/getImages';

type Props = NativeStackScreenProps<RootStackParamList, 'PhotoDetail'>;

const PhotoDetail: React.FC<Props> = ({ route }) => {
  const { imageUrl } = route.params;
  const width = useMemo(() => Dimensions.get('window').width, []);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    const error = validate(firstName, lastName, email, phone);
    if (error) {
      Alert.alert('Validation error', error);
      return;
    }
    try {
      setSubmitting(true);
      const form = new FormData();
      form.append('first_name', firstName.trim());
      form.append('last_name', lastName.trim());
      form.append('email', email.trim());
      form.append('phone', phone.trim());
      const fileName = `user_image_${Date.now()}.jpg`;
      form.append('user_image', {
        uri: imageUrl,
        name: fileName,
        type: 'image/jpeg',
      } as unknown as Blob);
      const response = await submitData(form);
      console.log('in the response', response)
      Alert.alert('Success', 'Details submitted successfully');
    } catch (error) {
      console.error('Error submitting data:', error);
      Alert.alert('Error', 'Failed to submit data');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Image
          source={{ uri: imageUrl }}
          style={{ width, height: undefined, aspectRatio: 1, resizeMode: 'contain', marginBottom: 16 }}
        />

        <CustomInput
          placeholder="Enter your first name"
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="words"
          left={<Text style={styles.label}>First name</Text>}
        />

        <CustomInput
          placeholder="Enter your last name"
          value={lastName}
          onChangeText={setLastName}
          autoCapitalize="words"
          left={<Text style={styles.label}>Last name</Text>}
        />

        <CustomInput
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          left={<Text style={styles.label}>Email</Text>}
        />

        <CustomInput
          placeholder="Enter your phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          left={<Text style={styles.label}>Phone</Text>}
        />

        <TouchableOpacity style={styles.submitBtn} onPress={onSubmit} disabled={submitting}>
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Submit</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 12,
    color: '#333',
  },
  submitBtn: {
    marginTop: 10,
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default PhotoDetail;
