const fs = require('fs');
const path = require('path');

const podfileDir = path.join(__dirname, 'ios', 'App');
const podfilePath = path.join(podfileDir, 'Podfile');

// We explicitly define the pods here to bypass issues where 'capacitor_pods' helper
// cannot be found or loaded in certain CI/CD environments (like Appflow).
// This ensures the iOS build has exactly what it needs plus our specific SDK pin.

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
  pod 'CapacitorCommunityAdmob', :path => '../../node_modules/@capacitor-community/admob'

  # FIXED: Pin Google Mobile Ads SDK to 10.14.0 to prevent v11 build errors
  pod 'Google-Mobile-Ads-SDK', '~> 10.14.0'
end
`;

try {
  // Only write if the directory exists (meaning ios platform was added)
  if (fs.existsSync(podfileDir)) {
    fs.writeFileSync(podfilePath, podfileContent);
    console.log('✅ Podfile generated successfully (Explicit configuration). Google Ads SDK pinned.');
  } else {
    console.log('⚠️ ios/App directory not found. Podfile generation skipped (will run later).');
  }
} catch (error) {
  console.error('❌ Error generating Podfile:', error);
}