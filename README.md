# Photo Sharing App

A real time photo-sharing and chat app built using React Native with real-time communication via WebSockets and user authentication via Clerk.

![Home Screen](https://github.com/Aryainguz/ping/blob/main/assets/Screenshot_1717950608.png)

## Features

- User authentication using Clerk.
- Real-time photo sharing using WebSockets.
- Private chat between users.

## Technologies Used

- React Native
- Expo
- WebSocket
- Clerk for authentication

## Setup

### Prerequisites

- Node.js
- Expo CLI
- Clerk account

### Frontend Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/photo-sharing-app.git
    cd photo-sharing-app
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up Clerk:
    - Follow Clerk's documentation to set up your application and obtain your API keys.
    - Add your Clerk keys in your application code.

4. Start the Expo server:
    ```bash
    expo start
    ```

### Backend Setup

   get backend signaling web socket server from this repository -  https://github.com/Aryainguz/ping-ws-server

## Running the App

1. Ensure both the Expo server and the WebSocket signaling server are running.
2. Open the Expo app on your mobile device or emulator.
3. Scan the QR code provided by the Expo server to open the app.
