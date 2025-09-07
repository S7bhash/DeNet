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

## Building for iOS & Android with Capacitor

To run this web application on a mobile device or simulator, we will use **Capacitor** to wrap it in a native project.

### 1. Prerequisites

First, ensure you have the required development environments set up.

-   **All Platforms:**
    -   [Node.js and npm](https://nodejs.org/): Required for installing Capacitor.
-   **iOS Development:**
    -   A macOS computer
    -   [Xcode](https://developer.apple.com/xcode/): Apple's IDE for iOS development.
    -   [CocoaPods](https://cocoapods.org/): A dependency manager for Swift and Objective-C projects. Install with `sudo gem install cocoapods`.
-   **Android Development:**
    -   [Java JDK](https://www.oracle.com/java/technologies/downloads/) (Version 11 or higher).
    -   [Android Studio](https://developer.android.com/studio): The IDE for Android development.

### 2. Project Setup

Follow these steps in your terminal, at the root of the project directory.

#### Step A: Install Capacitor
Install the Capacitor CLI (Command Line Interface) and the core native platform packages.

```bash
npm install @capacitor/cli @capacitor/core @capacitor/ios @capacitor/android
```

#### Step B: Initialize Capacitor
This command creates the `capacitor.config.ts` file, which configures your native app. Because the file is now included in the project, you can skip this step, but for future reference, the command would be:
```bash
npx cap init "Decentralized Sync" "com.example.decentralizedsync.app" --web-dir="www"
```

#### Step C: Prepare Web Assets
Capacitor needs a dedicated `www` directory containing all your web code.

1.  Create a new directory named `www` at the project root.
2.  **Copy all web files and folders** into the `www` directory. Your `www` folder's contents should look like this:
    ```
    www/
    ├── App.tsx
    ├── components/
    ├── constants.ts
    ├── index.html
    ├── index.tsx
    ├── metadata.json
    ├── services/
    ├── types.ts
    └── ... (and any other web assets)
    ```

#### Step D: Add Native Platforms
This command creates the native `ios` and `android` project folders.

```bash
# For iOS
npx cap add ios

# For Android
npx cap add android
```

### 3. Running on a Simulator

After the initial setup, you can run the app.

#### For iOS

1.  **Sync Web Assets:** This crucial command copies your web code from the `www` folder into the native iOS project and installs any required native dependencies (pods).
    ```bash
    npx cap sync ios
    ```
    > **Troubleshooting:** If you encounter build errors in Xcode related to missing pods, try running `npx pod-install` in the root directory, or `pod install` manually inside the `ios/App` directory and try again.

2.  **Open in Xcode:**
    ```bash
    npx cap open ios
    ```

3.  **Run the App:**
    -   Once Xcode opens, wait for it to finish indexing.
    -   Select your desired iPhone simulator from the list at the top of the window.
    -   Click the "Run" button (▶) to build and launch the app on the simulator.

#### For Android

1.  **Sync Web Assets:** This copies your web code into the native Android project.
    ```bash
    npx cap sync android
    ```

2.  **Open in Android Studio:**
    ```bash
    npx cap open android
    ```

3.  **Run the App:**
    -   Wait for Android Studio to sync the project with Gradle.
    -   If you don't have an emulator, create one via `Tools > AVD Manager`.
    -   Select your emulator from the device dropdown.
    -   Click the "Run" button (▶) to build and launch the app.
