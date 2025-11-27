const fs = require('fs');
const path = require('path');

const podfileDir = path.join(__dirname, 'ios', 'App');
const podfilePath = path.join(podfileDir, 'Podfile');

// We explicitly define the pods here to bypass issues where 'capacitor_pods' helper
// cannot be found or loaded in certain CI/CD environments (like Appflow).
// This ensures the iOS build has exactly what it needs.

const podfileContent = `
platform :ios, '13.0'
use_frameworks!

target 'App' do
  # Capacitor Core
  pod 'Capacitor', :path => '../../node_modules/@capacitor/ios'
  pod 'CapacitorCordova', :path => '../../node_modules/@capacitor/ios'

  # Capacitor Plugins (Manually added based on package.json dependencies)
  pod 'CapacitorApp', :path => '../../node_modules/@capacitor/app'
  pod 'CapacitorHaptics', :path => '../../node_modules/@capacitor/haptics'
  
  # AdMob Plugin
  # We do NOT manually add Google-Mobile-Ads-SDK here.
  # This plugin's podspec already declares the correct dependency.
  # Letting CocoaPods resolve it automatically prevents version mismatch errors.
  pod 'CapacitorCommunityAdmob', :path => '../../node_modules/@capacitor-community/admob'
end
`;

try {
  // Only write if the directory exists (meaning ios platform was added)
  if (fs.existsSync(podfileDir)) {
    fs.writeFileSync(podfilePath, podfileContent);
    console.log('✅ Podfile generated successfully. Auto-resolving dependencies.');
  } else {
    console.log('⚠️ ios/App directory not found. Podfile generation skipped (will run later).');
  }
} catch (error) {
  console.error('❌ Error generating Podfile:', error);
}