import { View, Text, StyleSheet, StatusBar } from 'react-native'
import React from 'react'

const ScreenWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <View style={styles.container}>
      <StatusBar />
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    }
})
export default ScreenWrapper