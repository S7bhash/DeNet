# Decentralized Sync Concept

This project is a high-fidelity UI/UX prototype of a decentralized, peer-to-peer (P2P) communication application. It simulates the experience of a secure, mobile-first chat platform where users (nodes) can share encrypted messages, files, polls, and more, with a focus on data synchronization and a modern, "geeky-cool" aesthetic.

The application is built entirely on the frontend to demonstrate user flows, animations, and the feel of a real P2P network, including a live simulation of nodes connecting, disconnecting, and syncing missed data.

## Features

- **Mobile-First Design:** A fluid, single-page application with native-like screen transitions.
- **Simulated P2P Network:**
  - A background service simulates peers sending messages and going online/offline.
  - **Connection Toggling:** Users can manually disconnect from the network.
  - **Data Synchronization:** Upon reconnecting, the app automatically fetches and displays all missed messages.
- **Rich Messaging:**
  - Text, image, video, and file sharing.
  - **Emoji Reactions:** Add/remove reactions, synced in real-time.
  - **Read Receipts:** Real-time indicators for "delivered" (✓) and "read" (✓✓).
  - **Message Deletion:** Users can delete their own messages.
- **Interactive Content:**
  - **Polls:** Create and vote on polls with results updated live.
  - **Events:** Create and share events with date, time, and location.
  - **Location Sharing:** Share a map with a pinned location.
- **Group Management:**
  - Create new groups ("networks") from a simulated contact list.
  - A full invitation system to accept or decline group invites.
- **Customization & UI/UX:**
  - Dynamic, graffiti-style backgrounds for chat and group list screens.
  - "Glassmorphism" effect for UI elements.
  - Profile customization (name and avatar).
  - Smooth animations for messages, modals, and navigation.
  - Simulated end-to-end encryption indicators to build user trust.

## Technology Stack

- **React 19:** For building the user interface.
- **TypeScript:** For static typing and code quality.
- **Tailwind CSS:** For styling the application.
- **Capacitor (for mobile builds):** To wrap the web application in a native shell for iOS and Android.

---

## Running the Project

### Prerequisites

- A modern web browser that supports ES modules.

### Running in the Browser

This is a static web project with no server-side build step. To run it, you can:
1. Use a simple local web server or a tool like the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension for VS Code.
2. Open the `index.html` file at the root of the project in the server's context.

---

## Building for iOS & Android (Production)

To run this web application on a mobile simulator, we will use **Capacitor** to wrap it in a native project.

### Prerequisites for Mobile Builds

1.  **Node.js and npm:** [Install Node.js](https://nodejs.org/)
2.  **iOS Development:**
    - A macOS computer
    - [Xcode](https://developer.apple.com/xcode/)
    - [CocoaPods](https://cocoapods.org/): `sudo gem install cocoapods`
3.  **Android Development:**
    - [Java JDK](https://www.oracle.com/java/technologies/downloads/)
    - [Android Studio](https://developer.android.com/studio)

### Recommended Method: Using the Setup Script

The easiest way to get started is by using the provided setup script. It automates all the necessary steps.

1.  **Make the script executable:**
    ```bash
    chmod +x setup.sh
    ```
2.  **Run the script:**
    ```bash
    ./setup.sh
    ```
3.  The script will guide you through the process. Once it's finished, you can open the native project directly.

    -   **For iOS:** `npx cap open ios`
    -   **For Android:** `npx cap open android`

### Manual Step-by-Step Instructions

If you prefer to set up the project manually, follow these steps.

#### 1. Project Setup

First, open your terminal in the project's root directory and install the Capacitor CLI and core packages.

```bash
npm install @capacitor/cli @capacitor/core
npm install @capacitor/ios @capacitor/android
```

#### 2. Initialize Capacitor

Initialize Capacitor for the project. When prompted, you can use the following details:
- **App Name:** Decentralized Sync
- **App ID:** com.example.decentralizedsync

```bash
npx cap init
```

This will create a `capacitor.config.ts` file.

#### 3. Configure Web Directory

Capacitor needs to know where your web assets are.
1.  Create a new directory named `www` in the project root.
2.  **Copy all project files and folders** (except for `node_modules` and `package.json`/`package-lock.json` if you have them) into the `www` directory. Your `www` directory should look like this:
    ```
    www/
    ├── App.tsx
    ├── components/
    ├── constants.ts
    ├── index.html
    ├── index.tsx
    ├── metadata.json
    ├── services/
    └── types.ts
    ```
3.  Open the generated `capacitor.config.ts` file and make sure the `webDir` is set to `'www'`.

```typescript
// capacitor.config.ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.decentralizedsync',
  appName: 'Decentralized Sync',
  webDir: 'www' // This is the important line
};

export default config;
```

#### 4. Add Mobile Platforms

Now, add the native iOS and Android projects.

```bash
# For iOS
npx cap add ios

# For Android
npx cap add android
```

#### 5. Sync Web Assets

Sync your web assets from the `www` directory into the native projects.

```bash
npx cap sync
```

#### 6. Run on iOS Simulator

1.  Open the native iOS project in Xcode.
    ```bash
    npx cap open ios
    ```
2.  Once Xcode opens, select your desired iPhone simulator from the top bar.
3.  Click the "Run" button (▶) to build and launch the app on the simulator.

#### 7. Run on Android Emulator

1.  Open Android Studio.
2.  Go to `Tools > AVD Manager` and create an Android Virtual Device (Emulator) if you don't have one.
3.  Open the native Android project in Android Studio.
    ```bash
    npx cap open android
    ```
4.  Android Studio will take a moment to sync Gradle.
5.  Once ready, select your emulator from the device dropdown.
6.  Click the "Run" button (▶) to build and launch the app on the emulator.
