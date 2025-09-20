import { View, StyleSheet, TouchableOpacity, TextInputProps, TextInput, Text } from 'react-native'
import React, { FC } from 'react'
 

interface InputProps extends TextInputProps {
    left?: React.ReactNode;
    right?: boolean;
    onClear?: () => void;
}

const CustomInput: FC<InputProps> = ({
    left,
    onClear,
    right,
    ...props
}) => {
    return (
        <View style={styles.flexRow}>
            {left ? <View style={styles.leftLabel}>{left}</View> : null}

            <TextInput
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
    )
}


const styles = StyleSheet.create({
    inputContainer: {
        flex: 1,
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        borderColor: '#ccc',
        borderWidth: 0.5,
        paddingVertical: 14,
        paddingBottom: 15,
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
    clearBtn: {
        paddingHorizontal: 10,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default CustomInput