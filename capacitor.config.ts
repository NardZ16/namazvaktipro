
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.namazvaktipro.app',
  appName: 'Namaz Vakti Pro',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    AdMob: {
      appId: "ca-app-pub-4319080566007267~XXXXXXXXXX" 
    }
  }
};

export default config;
