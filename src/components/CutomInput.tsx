import { View, StyleSheet, TouchableOpacity, TextInputProps, TextInput, Text } from 'react-native'
import React, { forwardRef } from 'react'
 

interface InputProps extends TextInputProps {
    left?: React.ReactNode;
    right?: boolean;
    onClear?: () => void;
    error?: string;
}

const CustomInput = forwardRef<TextInput, InputProps>(({
    left,
    onClear,
    right,
    error,
    ...props
}, ref) => {
    return (
        <View style={styles.container}>
            <View style={styles.flexRow}>
                {left ? <View style={styles.leftLabel}>{left}</View> : null}

                <TextInput
                    ref={ref}
                    {...props}
                    style={[styles.inputContainer, props.style]}
                    placeholderTextColor={'#999'}
                />

                {right && (
                    <TouchableOpacity
                        onPress={onClear}
                        accessibilityRole="button"
                        accessibilityLabel="Clear input"
                        style={styles.clearBtn}
                        disabled={!onClear}
                    >
                        <Text style={{ fontSize: 18, color: '#666' }}>×</Text>
                    </TouchableOpacity>
                )}
            </View>
            {!!error && <Text style={styles.errorText} accessibilityLiveRegion="polite">{error}</Text>}
        </View>
    )
})


const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    inputContainer: {
        flex: 1,
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        paddingVertical: 14,
        paddingBottom: 15,
        paddingHorizontal: 12,
        borderColor: '#ccc',
        borderWidth: 0.5,
        color: '#000',
        bottom: -1
    },
    icon: {
        width: '5%',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },
    leftLabel: {
        width: 110,
        paddingHorizontal: 12,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 10,
        width: '100%',
        marginVertical: 10,
        paddingRight: 8
    },
    errorText: {
        color: '#d93025',
        alignSelf: 'flex-end',
        fontSize: 12,
        marginTop: -6,
        marginBottom: 6,
        paddingHorizontal: 12,
    },
    clearBtn: {
        paddingHorizontal: 10,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default CustomInput