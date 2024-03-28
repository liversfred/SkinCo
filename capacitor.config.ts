import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.capstone.skinco',  // domain.identifier.app_name
  appName: 'SkinCo',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    LocalNotifications: {
      smallIcon: "ic_launcher_round",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
  },
};

export default config;
