import { NativeModules } from 'react-native'

const {
  JersIgnoreBatteryOptimizationPermission,
  BackgroundService,
  JersGetApplication,
  JersGetDisplay,
  JersAndroidShell
} = NativeModules

export const requestToIgnoreBatteryOptimization =
  async (): Promise<boolean> => {
    return await JersIgnoreBatteryOptimizationPermission.requestToIgnoreBatteryOptimization()
  }

export const isIgnoringBatteryOptimizations = async (): Promise<boolean> => {
  return await JersIgnoreBatteryOptimizationPermission.isIgnoringBatteryOptimizations()
}

export const listAllApps = async (): Promise<any> => {
  return await JersGetApplication.listApps()
}

export const getRefreshRates = async (): Promise<any> => {
  return await JersGetDisplay.refreshRates()
}

export const getCurrentRefreshRate = async (): Promise<number> => {
  return await JersGetDisplay.refreshRate()
}

export const getMaxRefreshRate = async (): Promise<number> => {
  return await JersGetDisplay.maxRefreshRate()
}

export const getMinRefreshRate = async (): Promise<number> => {
  return await JersGetDisplay.minRefreshRate()
}

export const getSystemIntValue = async (key: string): Promise<number> => {
  return await BackgroundService.getSystemIntValues(key)
}

export const openAccessbilitySettings = async (): Promise<string> => {
  return await BackgroundService.openAccessbilitySettings()
}

export const isAccessibilityServiceEnabled = async (): Promise<boolean> => {
  return await BackgroundService.isAccessibilityServiceEnabledByUser()
}

export const Shell = async (command: string): Promise<any> => {
  return await JersAndroidShell.executeCommand(command)
}
