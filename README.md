# Mim3 Discord Bot

Welcome to **Mim3**, your ultimate music companion on Discord! Mim3 is built to deliver high-quality audio streaming and an effortless music experience, keeping your server vibing 24/7.

## Features

- **🎵 Music Playback:** Enjoy smooth, uninterrupted music from your favorite platforms.
- **📥 YouTube & Spotify Support:** Play songs directly using YouTube or Spotify links.
- **📝 Easy Commands:** Simple and intuitive commands for playing, pausing, skipping, queuing, and more.
- **🔁 Playlist & Looping:** Queue multiple songs, shuffle, or loop your favorite tracks.
- **📡 24/7 Radio Mode:** Keep the tunes going nonstop with optional radio-style playback.

Bring the beats with Mim3 and transform your Discord server into a personal concert hall!

---

## Installation

Follow these steps to install and set up **Mim3 Discord Bot** on your system:

### 1. **Clone the Repository**

Clone the repository to your local machine using Git:

```bash
git clone https://github.com/mhtajan/mim3v2.git
```

### 2. **Install Dependencies**

Navigate to the project directory and install the necessary dependencies:

```bash
cd mim3v2
npm install
```

### 3. **Configure Environment Variables**

Create a `.env` file in the root directory and add the following configuration:

```bash
TOKEN=<your-discord-bot-token>
CLIENT_ID=<your-discord-client-id>
LAVALINK_PASSWORD=youshallnotpass
LAVALINK_PORT=2333
LAVALINK_HOST=localhost
```

### 4. **Configure `application.yml`**

There is already an `example_application.yml` file in the repository. To configure it:

1. **Rename the `example_application.yml` file** to `application.yml`:
   
   ```bash
   mv example_application.yml application.yml
   ```

2. **Edit the `application.yml` file** with your credentials:

   ```yaml
   # YouTube Configuration (Required for avoiding age restrictions by YouTube)
   youtubeConfig:
     email: <your-google-account-email>    # Email of your Google account
     password: <your-google-account-password> # Password of your Google account

   # Spotify Configuration
   spotify:
     clientId: <your-spotify-client-id>    # Spotify Client ID
     clientSecret: <your-spotify-client-secret> # Spotify Client Secret

   # Lavalink Configuration
   lavalink:
     password: youshallnotpass            # Lavalink server password (must match the Lavalink config)
     port: 2333                           # Lavalink server port
     host: localhost                      # Lavalink server host (usually localhost)
   ```

- **YouTube Config**: Use your Google account credentials to handle age-restricted content.
- **Spotify Config**: Register your application on the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications) to get your `clientId` and `clientSecret`.
- **Lavalink Config**: Ensure your Lavalink server is set up and running on `localhost:2333` with the correct password.

### 5. **Start the Bot**

Once you've set up your environment variables and the `application.yml` file, start the bot with the following command:

```bash
node ./bot/index.js
```

### 6. **Invite the Bot to Your Discord Server**

Go to the [Discord Developer Portal](https://discord.com/developers/applications), select your bot, and under the **OAuth2** section, generate an invite link with the necessary permissions (like reading messages, joining voice channels, and managing messages). 

Invite the bot to your server using that link.

---

### Troubleshooting

- Ensure you have [Node.js](https://nodejs.org/) installed (recommended version: 18.x or later).
- For issues with the Lavalink server, make sure the Lavalink server is running at `localhost:2333` with the correct password.
- If you encounter errors related to Spotify or YouTube, double-check your API credentials and ensure that your Google account is set up correctly.

---
