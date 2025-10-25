/**
 * Web Entry Point
 *
 * Bootstraps the React Native app for web using react-native-web
 */

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './package.json';

// Register the app for web
AppRegistry.registerComponent(appName, () => App);

// Run the app
AppRegistry.runApplication(appName, {
  rootTag: document.getElementById('root'),
});
