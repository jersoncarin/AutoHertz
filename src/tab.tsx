import React from 'react'
import { View, Text, Dimensions, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'

import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'

import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Apps from './tabs/Apps'
import { accentColor } from './config/color'

const Stack = createBottomTabNavigator()

export default function Tab(): JSX.Element {
  const insets = useSafeAreaInsets()

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        marginTop: hp(1)
      }}>
      <Stack.Navigator
        initialRouteName="Apps"
        screenOptions={{
          unmountOnBlur: false,
          headerShown: false,
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            height: 80 + insets.bottom,
            elevation: 0,
            borderTopWidth: 0,
            alignItems: 'center',
            width: Dimensions.get('window').width
          }
        }}>
        <Stack.Screen
          name="Apps"
          component={Apps}
          options={{
            tabBarIcon: ({ focused }: any) => (
              <View style={styles.iconContainer}>
                <AntDesign
                  name="appstore-o"
                  size={30}
                  color={focused ? accentColor : '#000'}
                />
                <Text
                  style={{
                    ...styles.text,
                    color: focused ? accentColor : '#000'
                  }}>
                  APPS
                </Text>
              </View>
            )
          }}
        />
        <Stack.Screen
          name="Settings"
          component={Apps}
          options={{
            tabBarIcon: ({ focused }: any) => (
              <View style={styles.iconContainer}>
                <Feather
                  name="settings"
                  size={30}
                  color={focused ? accentColor : '#000'}
                />
                <Text
                  style={{
                    ...styles.text,
                    color: focused ? accentColor : '#000'
                  }}>
                  SETTINGS
                </Text>
              </View>
            )
          }}
        />
        <Stack.Screen
          name="About"
          component={Apps}
          options={{
            tabBarIcon: ({ focused }: any) => (
              <View style={styles.iconContainer}>
                <AntDesign
                  name="infocirlceo"
                  size={30}
                  color={focused ? accentColor : '#000'}
                />
                <Text
                  style={{
                    ...styles.text,
                    color: focused ? accentColor : '#000'
                  }}>
                  ABOUT
                </Text>
              </View>
            )
          }}
        />
      </Stack.Navigator>
    </View>
  )
}

const styles = StyleSheet.create({
  iconContainer: {
    width: Dimensions.get('window').width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  text: {
    fontSize: wp(2.7),
    fontFamily: 'GothamRounded-Bold',
    marginTop: hp(0.6),
    textAlign: 'center'
  }
})
