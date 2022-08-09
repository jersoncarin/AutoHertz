import React, { useEffect, useRef, useState } from 'react'
import {
  StatusBar,
  useColorScheme,
  Platform,
  AppState,
  AppStateStatus,
  Alert,
  BackHandler
} from 'react-native'

import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'

import SplashScreen from 'react-native-splash-screen'
import LoadinIndicator from './components/LoadingIndicator'

import {
  isAccessibilityServiceEnabled,
  isIgnoringBatteryOptimizations,
  openAccessbilitySettings,
  requestToIgnoreBatteryOptimization,
  Shell
} from './services/module'
import Tab from './tab'

const App = () => {
  const isDarkMode = useColorScheme() === 'dark'
  const [isSupported, setIsSupported] = useState<boolean>(false)
  const [isIgnoreBO, setIsIgnoreBO] = useState<boolean>(false)
  const [isASEnabled, setIsASEnable] = useState<boolean>(false)
  const [isRooted, setIsRooted] = useState<boolean>(false)
  const appState = useRef<AppStateStatus>(AppState.currentState)

  useEffect(() => {
    // To make first only
    let hasGrantedBO: boolean = false

    const requestToIgnoreBO = async () => {
      const isIgnoringBO = await isIgnoringBatteryOptimizations()

      if (!isIgnoringBO) {
        const handleOpenSettings = async () => {
          const result = await requestToIgnoreBatteryOptimization()
          hasGrantedBO = result
          setIsIgnoreBO(result)
        }

        if (!hasGrantedBO) {
          Alert.alert(
            'Action required.',
            "This app required to disable the battery optimization, it wouldn't work if this is feature not disabled.",
            [{ text: 'OPEN SETTINGS', onPress: handleOpenSettings }]
          )
        }
      }

      return isIgnoringBO || hasGrantedBO
    }

    const requesToGrantAccessibilityService = async () => {
      const isASGranted = await isAccessibilityServiceEnabled()

      if (!isASGranted) {
        const handleOpenSettings = async () => {
          await openAccessbilitySettings()
        }

        Alert.alert(
          'Action required.',
          'This app required to enable in accessibility to monitor the app current refresh rate and behavior.',
          [{ text: 'OPEN SETTINGS', onPress: handleOpenSettings }]
        )
      }

      // Call again to make ask again or not
      setIsASEnable(await isAccessibilityServiceEnabled())

      return isASGranted
    }

    const prepareToLoadPermission = async () => {
      // Check if the device is rooted
      const shell = await Shell('su -c ls /data')
      const isRooted = shell.length !== 0

      if (!isRooted) {
        Alert.alert(
          'Action required.',
          "This app required rooted device or grant permission using like magisk manager or other root app manager, it wouldn't work if root is unavailable.",
          [{ text: 'EXIT', onPress: () => BackHandler.exitApp() }]
        )
        return 'denied'
      }

      // Set the app as rooted
      // because root granted this
      setIsRooted(isRooted)

      // Prepare the Battery optimization
      const isIgnoringBO = await isIgnoringBatteryOptimizations()
      setIsIgnoreBO(isIgnoringBO)

      // Prepare the accessibility authorization
      const isASGranted = await isAccessibilityServiceEnabled()
      setIsASEnable(isASGranted)

      return isIgnoringBO && isASGranted && isRooted
    }
    // This will invoke once the app is in foreground
    // or for the first time app called
    const handleState = async () => {
      // Load the needed permission
      const isPermissionLoaded = await prepareToLoadPermission()
      // If the permission Loaded
      // then just don't ask again for permission
      if (
        isPermissionLoaded === 'denied' ||
        (typeof isPermissionLoaded === 'boolean' && isPermissionLoaded)
      ) {
        return
      }

      // If the battery permission has been disable
      // then proceed to the next permission
      const isBatteryOptimizationDisable = await requestToIgnoreBO()

      if (isBatteryOptimizationDisable) {
        // Request for Accessbility service
        await requesToGrantAccessibilityService()
      }
    }

    // Declare null listener
    let appStateListener: any

    try {
      // Get the Api version of the device
      const ApiVersion = (Platform.constants as any).Version
      // Check if the ApiVersion is supported with this app
      // Note that Android 11 or API 30 is only supported
      // with this app
      setIsSupported(ApiVersion >= 30)

      // Give an alert message
      // if the device is not supported
      if (ApiVersion < 30) {
        Alert.alert('Notice.', 'This app will run only on Android 11 above.', [
          { text: 'EXIT', onPress: () => BackHandler.exitApp() }
        ])
      } else {
        // Call on mounted
        handleState()

        // Listen for the state if the app is in background
        // or foreground
        appStateListener = AppState.addEventListener(
          'change',
          async nextAppState => {
            const state = appState.current.match(/inactive|background/)
            if (state && nextAppState === 'active') handleState()
            appState.current = nextAppState
          }
        )
      }

      SplashScreen.hide()
    } catch (err: any) {
      // Todo handle the error
    }

    // Remove the listener
    // when the component unmounted
    return () => {
      if (appStateListener) appStateListener.remove()
    }
  }, [])

  return (
    <SafeAreaProvider style={{ backgroundColor: '#fff' }}>
      <StatusBar
        backgroundColor={isDarkMode ? 'black' : 'white'}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      {isIgnoreBO && isSupported && isRooted && isASEnabled ? (
        <NavigationContainer>
          <Tab />
        </NavigationContainer>
      ) : (
        <LoadinIndicator />
      )}
    </SafeAreaProvider>
  )
}

export default App
