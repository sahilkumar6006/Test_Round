import React, { useMemo, useState } from 'react';
import { Image, Dimensions, StyleSheet, Text, TouchableOpacity, Alert, ActivityIndicator, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
import CustomInput from '../../../components/CutomInput';
import { validate, validateAll, validateField, FormErrors } from '../../../utils/validate';
import { submitData } from '../../../api/getImages';
import { formFields } from '../../../fixtures';
import { UserFormData, UserFormDataKey } from '../../../types/forms';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

type Props = NativeStackScreenProps<RootStackParamList, 'PhotoDetail'>;

const PhotoDetail: React.FC<Props> = ({ route }) => {
    const { imageUrl } = route.params;
    const width = useMemo(() => Dimensions.get('window').width, []);

    const [formData, setFormData] = useState<UserFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});

    const firstNameRef = React.useRef<TextInput | null>(null);
    const lastNameRef = React.useRef<TextInput | null>(null);
    const emailRef = React.useRef<TextInput | null>(null);
    const phoneRef = React.useRef<TextInput | null>(null);

    const refMap: Record<UserFormDataKey, React.RefObject<TextInput | null>> = {
        firstName: firstNameRef,
        lastName: lastNameRef,
        email: emailRef,
        phone: phoneRef,
    };

    const handleInputChange = (field: UserFormDataKey, value: string) => {
        setFormData(prev => {
            const next = { ...prev, [field]: value } as UserFormData;
            const fieldError = validateField(field, next);
            setErrors(prevErrs => {
                const nextErrs = { ...prevErrs };
                if (fieldError) nextErrs[field] = fieldError;
                else delete nextErrs[field];
                return nextErrs;
            });
            return next;
        });
    };


    const onSubmit = async () => {
        const fieldErrors = validateAll(formData);
        if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
            const firstErrorKey = Object.keys(fieldErrors)[0] as UserFormDataKey | undefined;
            if (firstErrorKey) {
                const ref = refMap[firstErrorKey];
                // Delay to ensure state updates before focusing
                setTimeout(() => ref?.current?.focus(), 0);
            }
            return;
        }

        try {
            setSubmitting(true);
            const form = new FormData();
            form.append('first_name', formData.firstName.trim());
            form.append('last_name', formData.lastName.trim());
            form.append('email', formData.email.trim());
            form.append('phone', formData.phone.trim());
            const fileName = `user_image_${Date.now()}.jpg`;
            form.append('user_image', {
                uri: imageUrl,
                name: fileName,
                type: 'image/jpeg',
            } as any);
            const response = await submitData(form);
            console.log('in the response', response);
            Alert.alert('Success', 'Details submitted successfully');
        } catch (error) {
            console.error('Error submitting data:', error);
            Alert.alert('Error', 'Failed to submit data');
        } finally {
            setSubmitting(false);
        }
    };

    return (
       <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.content}
            enableOnAndroid
            enableAutomaticScroll
            extraScrollHeight={100}
            keyboardOpeningTime={0}
            scrollToOverflowEnabled
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
                <Image
                    source={{ uri: imageUrl }}
                    style={{ width: '100%', height: undefined, aspectRatio: 1, resizeMode: 'contain', marginBottom: 16 }}
                />

                {formFields.map((field, index) => {
                    const isLast = index === formFields.length - 1;
                    const currentRef = refMap[field.key];
                    const nextRef = !isLast ? refMap[formFields[index + 1].key] : null;
                    return (
                        <CustomInput
                            ref={currentRef}
                            key={field.key}
                            placeholder={field.placeholder}
                            value={formData[field.key]}
                            maxLength={field.key === 'phone' ? 10 : undefined}
                            onChangeText={(value) => handleInputChange(field.key, value)}
                            autoCapitalize={field.autoCapitalize}
                            keyboardType={field.keyboardType}
                            returnKeyType={isLast ? 'done' : 'next'}
                            blurOnSubmit={isLast}
                            onSubmitEditing={() => {
                                if (isLast) {
                                    onSubmit();
                                } else {
                                    nextRef?.current?.focus();
                                }
                            }}
                            error={errors[field.key]}
                            left={<Text style={styles.label}>{field.label}</Text>}
                        />
                    );
                })}
 <View style={{ height: 16 }} />
                <TouchableOpacity style={styles.submitBtn} onPress={onSubmit} disabled={submitting}>
                    {submitting ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.submitText}>Submit</Text>
                    )}
                </TouchableOpacity>

               
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 16,
        flexGrow: 1,
        paddingBottom: 120,
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