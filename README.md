# IoT Monitoring API

API de monitoring IoT pour smart home - Projet final Node.js & MongoDB.

## Prérequis

- Node.js 24 LTS
- pnpm
- Docker (pour MongoDB)

## Installation

```bash
# 1. Copier le fichier d'environnement
cp .env.example .env

# 2. Installer les dépendances
pnpm install

# 3. Lancer MongoDB
docker compose up -d

# 4. Lancer le serveur en mode développement
pnpm start:dev
```

## Vérification

```bash
curl http://localhost:3000/ping
# Réponse attendue : { "ok": true }
```

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `pnpm start:dev` | Lance le serveur en mode développement (watch) |
| `pnpm start` | Lance le serveur |
| `pnpm build` | Compile le projet |
| `pnpm db:reset` | Vide toutes les collections de la base de données |
| `pnpm simulate:device` | Simule un device IoT |
| `pnpm admin:approve-device <deviceId>` | Approuve un device |
| `pnpm admin:revoke-device <deviceId>` | Révoque un device |

## Structure du projet

```
src/
├── main.ts                 # Point d'entrée
├── app.module.ts           # Module racine
├── common/
│   ├── database/           # Configuration MongoDB
│   └── guards/             # Guards d'authentification (à implémenter)
├── ping/                   # Module ping (health check)
├── devices/                # Module devices (à implémenter)
├── telemetry/              # Module telemetry (à implémenter)
└── admin/                  # Module admin (à implémenter)
```

## Ce que vous devez implémenter

Consultez le fichier **CONSIGNES.md** pour les spécifications complètes du projet.

### Endpoints à développer

**Device (auth: `x-device-key`)**
- `POST /devices/register` - Demande d'accès
- `GET /devices/me` - Consulter son status
- `POST /telemetry` - Envoyer une mesure

**Admin (auth: `x-api-key`)**
- `GET /admin/devices` - Liste des devices
- `GET /admin/devices/:id` - Détail d'un device
- `POST /admin/devices/:id/approve` - Approuver un device
- `POST /admin/devices/:id/revoke` - Révoquer un device
- `GET /admin/devices/:id/telemetry` - Mesures paginées
- `GET /admin/devices/:id/telemetry/latest` - Dernière mesure
- `GET /admin/devices/:id/stats` - Stats agrégées

## Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `MONGODB_URI` | URI de connexion MongoDB | `mongodb://localhost:27017/iot_monitoring` |
| `PORT` | Port du serveur | `3000` |
| `ADMIN_API_KEY` | Clé API pour l'authentification admin | - |
