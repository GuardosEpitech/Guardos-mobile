rm -rf node_modules
echo "node_modules removed"
rm package-lock.json
echo "package-lock.json removed"
rm -rf android
echo "android removed"

echo "installing npm packages:"
npm install
echo "npm install done"

npx expo prebuild
echo "expo prebuild done"

echo "start build android apk"
eas build --platform android --local
