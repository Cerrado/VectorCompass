# Vector Compass

A React Native Expo app for connecting to and browsing Weaviate Vector Store collections.

## Features

- **Weaviate Connection**: Connect to any Weaviate instance with support for HTTP/HTTPS and API key authentication
- **Collection Browser**: View available collections in your Weaviate instance
- **Collection Management**: Delete collections directly from the UI
- **Object Viewer**: Display objects from any collection in both table and card formats
- **Real-time Data**: Refresh collections to see the latest data
- **Cross-platform**: Works on iOS, Android, and web

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)

### Installation

1. Clone the repository

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   # or
   npx expo start
   ```

4. Use the Expo Go app on your mobile device to scan the QR code, or press `w` to open in web browser

## Usage

### Connecting to Weaviate

1. **Configure Connection**: Enter your Weaviate instance details:
   - **Scheme**: Select HTTP or HTTPS
   - **Host**: Enter your Weaviate host (e.g., `localhost:8080` or `your-cluster.weaviate.network`)
   - **API Key**: Optional - enter your API key if authentication is required

2. **Connect**: Tap the "Connect" button to establish connection

### Browsing Collections

1. **Enter Collection Name**: Type the name of the collection you want to explore
2. **Browse Available Collections**: Tap the 📋 button to see a dropdown of available collections
3. **Load Collection**: Tap "Load Collection" to fetch all objects from the specified collection
4. **Delete Collection**: In the collections dropdown, tap the 🗑️ icon next to a collection to delete it (a confirmation dialog will appear)

### Viewing Data

- **Table View**: See objects in a structured table format with columns for ID, Class, Properties, and Vector information
- **Card View**: Switch to card view for a more detailed display of each object
- **Refresh**: Pull down to refresh the data in either view
- **Object Details**: Tap on any object in table view to see summary information

## Technical Details

### Architecture

- **WeaviateHttpClient.ts**: HTTP-based service layer for all Weaviate operations (more reliable than the TypeScript client)
- **WeaviateConnection.tsx**: Connection management component
- **CollectionViewer.tsx**: Main collection browsing interface
- **ObjectTable.tsx**: Table view component for object display

### Key Components

- **Connection Management**: Handles authentication and connection state via HTTP REST API
- **Collection Discovery**: Automatically fetches available collections using Weaviate's schema endpoint
- **Object Display**: Supports both tabular and card-based views
- **Error Handling**: Comprehensive error handling with user-friendly messages

### Dependencies

- **expo**: React Native framework
- **expo-router**: File-based routing for navigation
- **react-native**: Core React Native framework

### HTTP-based Client

This app uses a custom HTTP client instead of the official `weaviate-ts-client` for better React Native compatibility. The HTTP client directly communicates with Weaviate's REST API and GraphQL endpoints.

## Development

To run in development mode:

```bash
# Web
npm run web

# iOS Simulator
npm run ios

# Android Emulator
npm run android
```

## Configuration

The app automatically detects and connects to Weaviate instances. Supported configurations:

- Local development: `http://localhost:8080`
- Cloud instances: `https://your-cluster.weaviate.network`
- Custom deployments: Any HTTP/HTTPS endpoint

## Troubleshooting

- **Connection Issues**: Verify your Weaviate instance is running and accessible
- **Authentication Errors**: Check your API key if using Weaviate Cloud Service
- **Collection Not Found**: Ensure the collection name is correct and exists in your schema
- **Network Errors**: Check your internet connection and firewall settings

## License

This project is private and not licensed for public use.
# VectorCompass
