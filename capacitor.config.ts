import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.capstone.skinco',  // domain.identifier.app_name
  appName: 'SkinCo',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
