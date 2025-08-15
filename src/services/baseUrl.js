import { Platform } from 'react-native';

// const emulatorHost = Platform.OS === 'android' ? '10.0.2.2' : '192.168.1.100';
// const emulatorHost = Platform.OS === 'android' ? '192.168.1.100' : '10.0.2.2' ; //Jiofy
// const emulatorHost = Platform.OS === 'android' ? '192.168.110.35' : '10.0.2.2' ; //Samsung Galaxy
// 192.168.110.35
const emulatorHost = '192.168.1.100'
// const emulatorHost = '192.168.1.101'

export const BASE_URL = __DEV__
  ? `http://${emulatorHost}:5000`
  : 'https://your-production-api.com/api';