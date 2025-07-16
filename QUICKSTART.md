# Virtual Wardrobe App - Quick Start Guide

## 🚀 Getting Started

### 1. Install Dependencies
```bash
yarn install
```

### 2. Start Development Server
```bash
yarn start
```

### 3. Run on Device
- **Mobile**: Scan QR code with Expo Go app
- **Web**: Press `w` in terminal or visit http://localhost:19006
- **Android**: Press `a` in terminal (requires Android Studio)
- **iOS**: Press `i` in terminal (requires Xcode on macOS)

## 📱 App Features

### 🏠 Wardrobe Tab
- View all your scanned clothing items
- Filter by category (tops, bottoms, shoes, accessories, outerwear)
- Delete items you no longer need
- Pull to refresh your wardrobe

### 📷 Scan Tab
- Take photos of new clothing items
- Select photos from your gallery
- Categorize and name your items
- Choose colors for better organization

### 👔 Outfits Tab
- Create outfits by combining wardrobe items
- Save outfit combinations for later
- View all your created outfits
- Delete outfits you no longer want

### 🛍️ Online Tab
- Browse mock online clothing items
- Filter by category and search
- Add items to wishlist
- View prices and brand information

## 🔧 Technical Details

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Styling**: Tailwind CSS (NativeWind)
- **Database**: SQLite (local storage)
- **Navigation**: React Navigation
- **Camera**: Expo Camera & Image Picker

## 📝 Development Notes

- All data is stored locally on the device
- Camera permissions required for scanning clothes
- Photo library access needed for selecting existing images
- Works on iOS, Android, and Web (with limitations)

## 🐛 Troubleshooting

### Common Issues:
1. **Metro bundler issues**: Clear cache with `yarn start --clear`
2. **Permission errors**: Check camera/photo permissions in device settings
3. **TypeScript errors**: Run `yarn install` to ensure all types are installed
4. **Build errors**: Try `expo doctor` to diagnose issues

### Reset Everything:
```bash
# Clear all caches and reinstall
rm -rf node_modules yarn.lock
yarn install
yarn start --clear
```

## 📚 Next Steps

1. **Add Real Online API**: Replace mock data with real clothing API
2. **Cloud Sync**: Add user accounts and cloud storage
3. **AI Features**: Implement outfit recommendations
4. **Social Features**: Share outfits with friends
5. **Weather Integration**: Suggest outfits based on weather

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make changes and test thoroughly
4. Submit a pull request

Happy coding! 👗👔👠
