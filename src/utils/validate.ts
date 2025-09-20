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