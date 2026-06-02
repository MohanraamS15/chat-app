# Real-Time Chat Application

A browser-based real-time chat application built with Express and WebSockets using `ws`. Users can create or join chat rooms, send messages, and vote on messages within a room. Admins can open or close chat rooms.

## Features

- Create and join chat rooms
- Real-time messaging using WebSockets
- User presence tracking in rooms
- Message upvoting system
- Admin controls for opening/closing chat rooms
- Cooldown timer to prevent message spam
- Chat history sync for new room participants

## Tech Stack

- Node.js
- Express
- `ws` WebSocket library
- `crypto` for room admin token generation
- Frontend served from `src/`

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm installed

### Install dependencies

```bash
npm install
```

### Run the app

```bash
npm start
```

The server listens on port `5000` by default.

### Open the app

Visit:

```text
http://localhost:5000
```

## Project Structure

- `server.js` - Express server and WebSocket server logic
- `package.json` - Project metadata and dependencies
- `src/` - Frontend files
  - `index.html` - Main UI
  - `app.js` - Client-side WebSocket logic
  - `style.css` - Styling for the chat UI

## Usage

1. Open the app in your browser.
2. Enter a username.
3. Create a new room or join an existing room.
4. Send messages in real time.
5. Upvote messages to highlight or alert the room admin.

## Notes

- A user must set a username before creating or joining a room.
- Only the room admin can open or close the chat.
- Messages are limited by a cooldown timer between sends.

## License

This project is released under the ISC license.
