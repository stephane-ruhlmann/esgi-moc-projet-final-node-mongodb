# Scripts fournis

Ces scripts permettent de tester l'API du projet final.

## Installation

Copier les fichiers dans le dossier `scripts/` de votre projet :

```
scripts/
├── admin-approve-device.ts
├── admin-revoke-device.ts
└── simulate-device.ts
```

Ajouter les scripts dans `package.json` :

```json
{
  "scripts": {
    "simulate:device": "node --experimental-strip-types scripts/simulate-device.ts",
    "admin:approve-device": "node --experimental-strip-types scripts/admin-approve-device.ts",
    "admin:revoke-device": "node --experimental-strip-types scripts/admin-revoke-device.ts"
  }
}
```

## Configuration

### Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `API_URL` | URL de l'API | `http://localhost:3000` |
| `ADMIN_API_KEY` | Clé API admin | _(requis pour scripts admin)_ |

Exemple avec fichier `.env` :

```bash
API_URL=http://localhost:3000
ADMIN_API_KEY=votre-cle-api-admin
```

---

## Scripts

### `pnpm simulate:device`

Simule un device IoT complet :

1. S'enregistre auprès de l'API (`POST /devices/register`)
2. Poll son status jusqu'à activation (`GET /devices/me`)
3. Envoie de la télémétrie en boucle (`POST /telemetry`)

**Usage :**

```bash
# Device climate (défaut)
pnpm simulate:device

# Device presence
pnpm simulate:device --type presence

# Avec un nom personnalisé
pnpm simulate:device --type climate --name "Salon - Température"
```

**Flux :**

```
$ pnpm simulate:device --type climate

🚀 Simulation de device IoT

📝 Enregistrement du device...
   ID: a1b2c3d4-...
   Nom: climate-sensor-abc123
   Type: climate
✅ Enregistré avec succès
   Device Key: x1y2z3-...
   Status: pending

⏳ En attente d'approbation par l'admin...
   (Poll toutes les 5s, max 60 tentatives)
   💡 Utilisez: pnpm admin:approve-device <deviceId>

   Tentative 3/60 - Status: pending

✅ Device activé !

🔄 Démarrage de l'envoi de télémétrie (toutes les 10s)
   Appuyez sur Ctrl+C pour arrêter

📡 Télémétrie envoyée: 22.5°C, 45% HR, batterie 92%
📡 Télémétrie envoyée: 22.8°C, 44% HR, batterie 92%
...
```

---

### `pnpm admin:approve-device <deviceId>`

Approuve un device en attente.

**Usage :**

```bash
pnpm admin:approve-device a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

**Sortie :**

```
🔄 Approbation du device a1b2c3d4-...
✅ Device approuvé avec succès
   Device ID: a1b2c3d4-...
   Status: active
```

---

### `pnpm admin:revoke-device <deviceId>`

Révoque l'accès d'un device.

**Usage :**

```bash
pnpm admin:revoke-device a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

**Sortie :**

```
🔄 Révocation du device a1b2c3d4-...
✅ Device révoqué avec succès
   Device ID: a1b2c3d4-...
   Status: revoked
```

---

## Scénario de test complet

**Terminal 1** — Lancer l'API :

```bash
pnpm dev
```

**Terminal 2** — Simuler un device :

```bash
pnpm simulate:device --type climate --name "Capteur salon"
# Le script attend l'approbation...
```

**Terminal 3** — Approuver le device :

```bash
# Copier le deviceId affiché dans le terminal 2
pnpm admin:approve-device <deviceId>
```

Le terminal 2 détecte l'activation et commence à envoyer de la télémétrie.

**Vérifier les données :**

```bash
# Voir la dernière mesure
curl -H "x-api-key: $ADMIN_API_KEY" \
  http://localhost:3000/admin/devices/<deviceId>/telemetry/latest

# Voir les stats
curl -H "x-api-key: $ADMIN_API_KEY" \
  "http://localhost:3000/admin/devices/<deviceId>/stats?from=2026-01-01&to=2026-12-31"
```

**Révoquer le device :**

```bash
pnpm admin:revoke-device <deviceId>
```

Le terminal 2 détecte la révocation et s'arrête.
