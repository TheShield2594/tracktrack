# TrackTrack

A self-hosted subscription tracker built with Next.js and SQLite. Monitor all your recurring expenses, visualize spending trends, and never miss a renewal date.

## Features

- Dashboard with spending overview and upcoming renewals
- Per-subscription management (add, edit, cancel)
- Analytics with charts and category breakdowns
- Calendar view of billing dates
- Fully local — data lives in a SQLite file, no external database required

## Quick Start

### Docker Compose (recommended)

**Prerequisites:** [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) (v2+)

```bash
# Clone the repository
git clone https://github.com/theshield2594/tracktrack.git
cd tracktrack

# Build and start
docker compose up -d --build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The app pre-seeds a handful of demo subscriptions on first launch so you can explore right away. Replace them with your own data via the Subscriptions page.

#### Custom port

```bash
PORT=8080 docker compose up -d --build
```

#### Stop / remove

```bash
docker compose down          # stop containers, keep data volume
docker compose down -v       # stop containers AND delete data
```

#### Update to latest code

```bash
git pull
docker compose up -d --build
```

---

### Docker (without Compose)

```bash
# Build the image
docker build -t tracktrack .

# Run with a named volume so data persists across restarts
docker run -d \
  --name tracktrack \
  --restart unless-stopped \
  -p 3000:3000 \
  -v tracktrack-data:/app/data \
  tracktrack
```

---

### Local development (Node.js)

**Prerequisites:** Node.js 22+

```bash
git clone https://github.com/theshield2594/tracktrack.git
cd tracktrack
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The dev server supports hot reload.

---

## Data persistence

SQLite database is stored in the `/app/data` directory inside the container, mounted as a named Docker volume (`tracktrack-data`). The database file survives container restarts and image rebuilds as long as the volume is not removed.

To back up your data:

```bash
docker run --rm \
  -v tracktrack-data:/data \
  -v "$(pwd)":/backup \
  alpine tar czf /backup/tracktrack-backup.tar.gz -C /data .
```

To restore:

```bash
docker run --rm \
  -v tracktrack-data:/data \
  -v "$(pwd)":/backup \
  alpine tar xzf /backup/tracktrack-backup.tar.gz -C /data
```

---

## Portainer deployment

**Option A — Repository stack (recommended):**  
Stacks → Add stack → Repository → point to this repo. Portainer will clone and build automatically.

**Option B — Pre-built image:**  
Comment out the `build:` block in `docker-compose.yml`, set the `image:` field to your registry image, push the image, then deploy.

---

## Traefik reverse proxy

The compose file includes Traefik labels. To enable, change the label in `docker-compose.yml`:

```yaml
- "traefik.enable=true"
```

Then add your Traefik router/service labels as needed.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | SQLite via better-sqlite3 |
| Charts | Recharts |
| Runtime | Node.js 22 |

## License

MIT
