export const validate = (firstName: string, lastName: string, email: string, phone: string) => {
    if (!firstName.trim()) return 'First name is required';
    if (!lastName.trim()) return 'Last name is required';
    if (!email.trim()) return 'Email is required';
    const emailRe = /^\S+@\S+\.\S+$/;
    if (!emailRe.test(email)) return 'Please enter a valid email address';
    if (!phone.trim()) return 'Phone number is required';
    const phoneDigits = phone.replace(/[^0-9]/g, '');
    if (phoneDigits.length < 7) return 'Please enter a valid phone number';
    return null;
};

import { UserFormData, UserFormDataKey } from "../types/forms";

export type FormErrors = Partial<Record<UserFormDataKey, string>>;

export const validateField = (key: UserFormDataKey, form: UserFormData): string | undefined => {
    const emailRe = /^\S+@\S+\.\S+$/;
    switch (key) {
        case 'firstName':
            if (!form.firstName.trim()) return 'First name is required';
            return undefined;
        case 'lastName':
            if (!form.lastName.trim()) return 'Last name is required';
            return undefined;
        case 'email':
            if (!form.email.trim()) return 'Email is required';
            if (!emailRe.test(form.email)) return 'Please enter a valid email address';
            return undefined;
        case 'phone':
            if (!form.phone.trim()) return 'Phone number is required';
            const phoneDigits = form.phone.replace(/[^0-9]/g, '');
            if (phoneDigits.length < 7) return 'Please enter a valid phone number';
            return undefined;
        default:
            return undefined;
    }
};

export const validateAll = (form: UserFormData): FormErrors => {
    const errors: FormErrors = {};
    (Object.keys(form) as UserFormDataKey[]).forEach((key) => {
        const err = validateField(key, form);
        if (err) errors[key] = err;
    });
    return errors;
};