export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export type UserFormDataKey = keyof UserFormData;
