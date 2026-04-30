# bf_planning

Calendrier mensuel de planning pour indiquer qui est de service (Yann ou Bruno) le matin et le soir chaque jour du mois.

## Fonctionnement

- **Mode vue** (public) : affiche le calendrier du mois en cours, navigation entre les mois
- **Mode édition** (protégé par mot de passe) : cliquez sur un créneau pour faire tourner l'assignation — vide → Yann → Bruno → vide

## Pré-requis

- Node.js (v18+) et npm
- nginx (pour la production)

## Installation

```bash
git clone <repo-url> bf_planning
cd bf_planning
npm install
cp .env .env.local   # ou créez .env directement
```

Éditez `.env` :

```
APP_PASSWORD=votre-mot-de-passe
PORT=3000
```

## Lancer en local

```bash
APP_PASSWORD=test123 node server.js
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## Structure du projet

```
bf_planning/
├── package.json
├── server.js                  # Backend Express
├── .env                       # APP_PASSWORD, PORT (non versionné)
├── data/                      # Fichiers JSON par mois (non versionnés)
│   └── 2026-04.json           # Exemple : { "1": { "morning": "Yann", "evening": null }, ... }
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
└── deploy/
    ├── bf_planning.service    # Unité systemd
    └── nginx-bf_planning.conf
```

## Déploiement sur Ubuntu 24.04

### 1. Créer `/opt/bf_planning/.env`

Avant de lancer l'installation, créez le fichier `.env` sur le serveur :

```bash
sudo mkdir -p /opt/bf_planning
sudo nano /opt/bf_planning/.env
```

Contenu :

```
APP_PASSWORD=votre-mot-de-passe-secret
PORT=3000
```

### 2. Lancer le script d'installation

Depuis le répertoire du projet cloné sur le serveur :

```bash
sudo bash install.sh
```

Le script effectue automatiquement :
- installation de Node.js/npm si absent
- copie des fichiers vers `/opt/bf_planning/`
- `npm install --production`
- configuration du service systemd (`bf_planning.service`)
- configuration nginx (reverse proxy port 80 → 3000)
- démarrage du service

> Adaptez `server_name` dans [deploy/nginx-bf_planning.conf](deploy/nginx-bf_planning.conf) si vous avez un nom de domaine.

## API

| Méthode | URL | Description |
|---------|-----|-------------|
| GET | `/api/schedule/:year/:month` | Retourne les données du mois |
| POST | `/api/schedule/:year/:month` | Sauvegarde (header `x-password` requis) |
| POST | `/api/auth` | Vérifie le mot de passe |
