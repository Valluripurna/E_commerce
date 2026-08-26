/**
 * @format
 */

import 'react-native-gesture-handler';
import {enableFreeze} from 'react-native-screens';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

enableFreeze(false);

AppRegistry.registerComponent(appName, () => App);
