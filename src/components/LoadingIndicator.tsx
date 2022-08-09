import { StyleSheet, View, ActivityIndicator } from 'react-native'
import React from 'react'
import { accentColor } from '../config/color'

export default function LoadinIndicator(): JSX.Element {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={60} color={accentColor} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
