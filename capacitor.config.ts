import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.decentralizedsync.app',
  appName: 'Decentralized Sync',
  webDir: 'www',
  // fix: Removed 'bundledWebRuntime' as it is deprecated and no longer part of CapacitorConfig.
};

export default config;
