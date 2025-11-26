const fs = require('fs');
const path = require('path');

const podfileDir = path.join(__dirname, 'ios', 'App');
const podfilePath = path.join(podfileDir, 'Podfile');

const podfileContent = `
platform :ios, '13.0'
use_frameworks!

target 'App' do
  config = use_native_modules!

  # Pin Google Mobile Ads SDK to 10.14.0 to fix build errors with Capacitor AdMob plugin
  pod 'Google-Mobile-Ads-SDK', '~> 10.14.0'

  use_frameworks!
end
`;

try {
  if (fs.existsSync(podfileDir)) {
    fs.writeFileSync(podfilePath, podfileContent);
    console.log('✅ Podfile generated successfully. Google Ads SDK pinned to ~> 10.14.0');
  } else {
    console.log('⚠️ ios/App directory not found. Podfile generation skipped (will run later).');
  }
} catch (error) {
  console.error('❌ Error generating Podfile:', error);
}