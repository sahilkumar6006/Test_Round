import { KeyboardTypeOptions } from "react-native";
import { UserFormDataKey } from "../types/forms";

    export const formFields = [
        {
            key: 'firstName' as UserFormDataKey,
            placeholder: 'Enter your first name',
            label: 'First name',
            autoCapitalize: 'words' as 'words' | 'sentences' | 'characters' | 'none',
            keyboardType: 'default' as KeyboardTypeOptions,
            autoCorrect: false,
            autoComplete: 'name-given' as any,
            textContentType: 'givenName' as any,
        },
        {
            key: 'lastName' as UserFormDataKey,
            placeholder: 'Enter your last name',
            label: 'Last name',
            autoCapitalize: 'words' as 'words' | 'sentences' | 'characters' | 'none',
            keyboardType: 'default' as KeyboardTypeOptions,
            autoCorrect: false,
            autoComplete: 'name-family',
            textContentType: 'familyName',
        },
        {
            key: 'email' as UserFormDataKey,
            placeholder: 'Enter your email',
            label: 'Email',
            autoCapitalize: 'none' as 'words' | 'sentences' | 'characters' | 'none',
            keyboardType: 'email-address' as KeyboardTypeOptions,
            autoCorrect: false,
            autoComplete: 'email' ,
            textContentType: 'emailAddress',
        },
        {
            key: 'phone' as UserFormDataKey,
            placeholder: 'Enter your phone',
            label: 'Phone',
            autoCapitalize: 'none' as 'words' | 'sentences' | 'characters' | 'none',
            keyboardType: 'phone-pad' as KeyboardTypeOptions,
            autoCorrect: false,
            autoComplete: 'tel' ,
            textContentType: 'telephoneNumber',
        },
    ];
