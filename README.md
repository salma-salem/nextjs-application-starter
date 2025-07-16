# Virtual Wardrobe App

A React Native mobile application built with Expo that allows users to create a virtual wardrobe by scanning their clothes and creating outfits.

## Features

- **Virtual Wardrobe**: Scan and store your clothing items with photos
- **Camera Integration**: Take photos of clothes or select from gallery
- **Outfit Creation**: Mix and match items from your wardrobe to create outfits
- **Online Store**: Browse online clothing items and add to wishlist
- **Categories**: Organize clothes by type (tops, bottoms, shoes, accessories, outerwear)
- **Local Storage**: All data stored locally using SQLite

## Tech Stack

- **React Native** with **Expo**
- **TypeScript** for type safety
- **Tailwind CSS** (NativeWind) for styling
- **SQLite** for local database
- **Expo Camera** for photo capture
- **React Navigation** for navigation

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Yarn package manager
- Expo CLI
- Expo Go app on your mobile device

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   yarn install
   ```

3. Start the development server:
   ```bash
   yarn start
   ```

4. Scan the QR code with Expo Go app on your mobile device

## Project Structure

```
src/
├── screens/
│   ├── WardrobeScreen.tsx      # Main wardrobe view
│   ├── ScanClothesScreen.tsx   # Camera/scanning interface
│   ├── OutfitsScreen.tsx       # Outfit creation and management
│   └── OnlineItemsScreen.tsx   # Online store browsing
├── services/
│   ├── database.ts             # SQLite database operations
│   └── storage.ts              # File storage management
└── types/
    └── index.ts                # TypeScript type definitions
```

## Usage

1. **Add Clothes**: Use the "Scan" tab to take photos of your clothes or select from gallery
2. **Organize**: Categorize items by type and color
3. **Create Outfits**: Use the "Outfits" tab to combine items into complete looks
4. **Browse Online**: Explore online items in the "Online" tab

## Permissions

The app requires the following permissions:
- **Camera**: To take photos of clothing items
- **Photo Library**: To select existing photos from your device

## Development

To run in development mode:

```bash
# Start the Expo development server
yarn start

# Run on Android
yarn android

# Run on iOS
yarn ios
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
