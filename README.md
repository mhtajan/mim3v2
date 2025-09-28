# Mim3 Discord Bot (v3)

Welcome to **Mim3v3**, the **third generation** of the Mim3 Discord music bot 🎶.
This version has been reimagined to be **simpler, faster, and more user-friendly**, making it easier than ever to bring music into your Discord server.

With Mim3v3, you get:

* **🚀 Streamlined Setup** – Connect quickly to a Lavalink server with minimal configuration.
* **🎵 Reliable Music Playback** – Play, queue, and manage songs with smooth, high-quality audio.
* **🛠️ Easy to Use Commands** – A cleaner and more intuitive command system for everyone in your server.
* **📡 24/7 Music Mode** – Keep the vibes going all day, every day.

Mim3v3 takes everything you loved about the earlier versions of Mim3 and makes it **lighter, more stable, and easier to manage**.

Bring Mim3v3 into your server and turn it into your personal music lounge!

---

## Installation

Follow these steps to install and set up **Mim3v3 Discord Bot** on your system:

### 1. **Clone the Repository**

Clone the repository to your local machine using Git:

```bash
git clone https://github.com/mhtajan/mim3v3.git
```

### 2. **Install Dependencies**

Navigate to the project directory and install the necessary dependencies:

```bash
cd mim3v3
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

### 4. **Connect to a Lavalink Server**

Mim3v3 requires a running **Lavalink server** for music playback. You have two options:

1. **Use Your Own Lavalink Server**

   * Download Lavalink from the [official repository](https://github.com/freyacodes/Lavalink/releases).
   * Run it with:

     ```bash
     java -jar Lavalink.jar
     ```
   * Make sure the `server.yml` Lavalink configuration matches your `.env` values (`host`, `port`, `password`).

2. **Use a Public Lavalink Node**

   * You can also connect to public Lavalink nodes if you don’t want to host one yourself.
   * Update your `.env` file with the host, port, and password provided by the public node service.

Example `.env` using a remote Lavalink node:

```bash
TOKEN=<your-discord-bot-token>
CLIENT_ID=<your-discord-client-id>
LAVALINK_PASSWORD=<remote-node-password>
LAVALINK_PORT=443
LAVALINK_HOST=<remote-node-host>
```

### 5. **Start the Bot**

Once you've set up your environment variables and Lavalink connection, start the bot with the following command:

```bash
node ./bot/index.js
```

### 6. **Invite the Bot to Your Discord Server**

Go to the [Discord Developer Portal](https://discord.com/developers/applications), select your bot, and under the **OAuth2** section, generate an invite link with the necessary permissions (like reading messages, joining voice channels, and managing messages).

Invite the bot to your server using that link.

---

