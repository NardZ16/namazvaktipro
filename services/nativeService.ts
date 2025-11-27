// This service abstracts Native (Capacitor) features from Web features.
// It allows the app to run on Web (using AdSense/Navigator) and Native (using AdMob/Haptics).

import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, AdMobInitializationOptions } from '@capacitor-community/admob';

// AdMob Official Test IDs
const adConfig = {
    android: {
        banner: 'ca-app-pub-3940256099942544/6300978111',
    },
    ios: {
        banner: 'ca-app-pub-3940256099942544/2934735716',
    },
    // YOUR REAL ADMOB ID
    production: {
        banner: 'ca-app-pub-4319080566007267/3273590664', 
    }
};

const isNativePlatform = (): boolean => {
  // Check if Capacitor bridge is injected
  return (window as any).Capacitor?.isNativePlatform();
};

const getPlatform = (): 'android' | 'ios' | 'web' => {
    return (window as any).Capacitor?.getPlatform() || 'web';
};

export const triggerHaptic = async (pattern: 'light' | 'medium' | 'heavy' | 'success' | 'warning') => {
  if (isNativePlatform()) {
    try {
        const Haptics = (window as any).Capacitor?.Plugins?.Haptics;
        if (!Haptics) return;

        if (pattern === 'success') {
             await Haptics.notification({ type: 'SUCCESS' });
        } else if (pattern === 'warning') {
             await Haptics.notification({ type: 'WARNING' });
        } else {
             const style = pattern === 'heavy' ? 'HEAVY' : pattern === 'medium' ? 'MEDIUM' : 'LIGHT';
             await Haptics.impact({ style });
        }
    } catch (e) {
        console.warn("Native Haptics failed", e);
    }
  } else {
    // Web Fallback
    if (!navigator.vibrate) return;
    
    switch (pattern) {
        case 'light': navigator.vibrate(10); break;
        case 'medium': navigator.vibrate(40); break;
        case 'heavy': navigator.vibrate([50, 50]); break;
        case 'success': navigator.vibrate([50, 50, 50]); break;
        case 'warning': navigator.vibrate([100, 50, 100]); break;
    }
  }
};

export const initializeAdMob = async () => {
    if (!isNativePlatform()) return;

    try {
        // Initialize AdMob
        const { status } = await AdMob.trackingAuthorizationStatus();
        
        // Only request if not determined (iOS 14+)
        if (status === 'notDetermined') {
             await AdMob.requestTrackingAuthorization();
        }

        await AdMob.initialize({
            requestTrackingAuthorization: true,
            initializeForTesting: true, // Set to false for production if needed, but safe for now
        });
        
    } catch (e) {
        console.error("AdMob Init Failed", e);
    }
};

export const showBottomBanner = async () => {
    if (!isNativePlatform()) return;

    try {
         const platform = getPlatform();
         
         // --- CONFIGURATION ---
         // To use REAL ADS: set useRealAds = true;
         // To use TEST ADS: set useRealAds = false; (Recommended for Development)
         const useRealAds = false; 

         const adId = useRealAds 
            ? adConfig.production.banner 
            : (platform === 'ios' ? adConfig.ios.banner : adConfig.android.banner);

         const options: BannerAdOptions = {
            adId: adId, 
            adSize: BannerAdSize.ADAPTIVE_BANNER,
            position: BannerAdPosition.BOTTOM,
            margin: 0,
            isTesting: !useRealAds
         };
         
         await AdMob.showBanner(options);
    } catch (e) {
        console.error("AdMob Show Failed", e);
    }
};

export const hideBanner = async () => {
    if (!isNativePlatform()) return;
    try {
        await AdMob.hideBanner();
    } catch (e) {}
};

export const isNative = isNativePlatform;
