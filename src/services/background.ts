import AsyncStorage from '@react-native-async-storage/async-storage'
import { APP_REFRESH_RATES_KEY } from '../tabs/Apps'
import { getMaxRefreshRate, getSystemIntValue, Shell } from './module'
import { getBundleId } from 'react-native-device-info'

export default async function BackgroundService({
  package_name
}: any): Promise<void> {
  try {
    const currentBundleId = getBundleId()

    // Don't execute the service when the
    // foreground app is this app
    if (currentBundleId === package_name) return

    // Get the app the set the refresh Rates
    let appRefreshRates = await AsyncStorage.getItem(APP_REFRESH_RATES_KEY)

    // If no refresh rate set
    // then do nothing
    if (appRefreshRates === null) return

    // Decode the JSON formatted into Object
    const appRefreshRatesObject = JSON.parse(appRefreshRates)

    // Get the refresh rate value
    const refreshRateValue = appRefreshRatesObject[package_name]

    console.log(package_name)

    // Store the immutable user refresh rate
    let userRefreshRate: number = 0

    try {
      userRefreshRate = await getSystemIntValue('user_refresh_rate')
    } catch (e) {}

    // Check if refresh value is set for this app
    if (!refreshRateValue) {
      await Shell('su -c settings put system min_refresh_rate 0')
      await Shell(
        'su -c settings put system peak_refresh_rate ' +
          String(userRefreshRate ? userRefreshRate : 60)
      )
      return
    }

    if (refreshRateValue.value === 'auto') {
      await Shell('su -c settings put system min_refresh_rate 0')
      await Shell(
        'su -c settings put system peak_refresh_rate ' + userRefreshRate
      )
    } else {
      await Shell(
        `su -c settings put system min_refresh_rate ${refreshRateValue.value}`
      )
      await Shell(
        `su -c settings put system peak_refresh_rate ${refreshRateValue.value}`
      )
    }
  } catch (e: any) {
    console.log(e.message)
  }
}
