# Agar.io Clone

A multiplayer agar.io clone. Play locally on your network or deploy to Koyeb for anyone on the internet to join.

---

## Run locally

```bash
npm install
node server.js
```

Open **http://localhost:3000**. Share your LAN IP (e.g. `http://192.168.1.42:3000`) with friends on the same network.

To find your local IP:
- **Windows** — `ipconfig` → IPv4 Address
- **Mac/Linux** — `ifconfig` or `ip addr` → `inet` under your network interface

Custom port: `PORT=8080 node server.js`

---

## Deploy to Koyeb (public internet)

Deploying puts the game on a public URL so anyone anywhere can join.

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2. Create a Koyeb service

1. Go to [koyeb.com](https://koyeb.com) and sign in (free tier works).
2. Click **Create Service** → **GitHub**.
3. Connect your GitHub account and select this repo.
4. Koyeb will auto-detect the `Dockerfile`. Leave all build settings as-is.
5. Under **Ports**, confirm port **8000** is listed (Koyeb's default).
6. Click **Deploy**.

Koyeb will build the Docker image, run it, and give you a public URL like:
```
https://your-service-abc123.koyeb.app
```

Share that URL — anyone with it can open the game and play.

### 3. That's it

The server reads `PORT` from the environment automatically (Koyeb sets it). The `/health` endpoint is already wired up for Koyeb's health checks.

---

## Config

Edit **`config.js`** to tune gameplay:

| Setting | Default | Description |
|---------|---------|-------------|
| `port` | `3000` | Local port (Koyeb overrides this with $PORT) |
| `gameWidth` / `gameHeight` | `5000` | Map size |
| `maxFood` | `1000` | Max food pellets |
| `maxVirus` | `50` | Max viruses |
| `defaultPlayerMass` | `10` | Starting mass |
| `adminPass` | `"DEFAULT"` | In-game admin password — change this |
| `networkUpdateFactor` | `40` | Position updates per second sent to clients |

---

## Controls

| Action | Input |
|--------|-------|
| Move | Mouse |
| Split | Space |
| Fire food | W |
| Spectate | Spectate button on start screen |

---

## File structure

```
├── server.js          <- entry point  (node server.js)
├── server/            <- game server (Express + Socket.io + game logic)
├── client/            <- pre-built frontend (HTML, CSS, bundled JS, assets)
├── config.js          <- gameplay settings
├── Dockerfile         <- Koyeb / Docker deployment
├── package.json
└── data/              <- auto-created; stores chat + login logs as JSON
```

---

## Notes

- **Scaling**: Koyeb's free tier runs a single instance, which is perfect. Socket.io works without sticky sessions at one instance. If you ever scale to multiple instances you would need a Redis adapter for Socket.io.
- **Persistence**: Chat logs are written to data/ inside the container. They reset on each deployment (containers are stateless). That is fine for a game server.
