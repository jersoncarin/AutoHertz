import { AppRegistry } from 'react-native'
import App from './src/App'
import { name as appName } from './app.json'
import BackgroundService from './src/services/background'

AppRegistry.registerHeadlessTask('RefreshRateTask', () => BackgroundService)
AppRegistry.registerComponent(appName, () => App)
