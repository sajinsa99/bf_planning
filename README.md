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
    ├── bf-planning.service    # Unité systemd
    └── nginx-bf-planning.conf
```

## Déploiement sur Ubuntu 24.04

### 1. Installer Node.js

```bash
sudo apt install nodejs npm
```

### 2. Copier le projet

```bash
sudo cp -r bf_planning /opt/bf-planning
```

### 3. Installer les dépendances

```bash
cd /opt/bf-planning && sudo npm install --production
```

### 4. Créer le fichier `.env`

```bash
sudo nano /opt/bf-planning/.env
```

Contenu :

```
APP_PASSWORD=votre-mot-de-passe-secret
PORT=3000
```

### 5. Préparer le dossier data

```bash
sudo mkdir -p /opt/bf-planning/data
sudo chown www-data:www-data /opt/bf-planning/data
```

### 6. Installer le service systemd

```bash
sudo cp /opt/bf-planning/deploy/bf-planning.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable bf-planning
sudo systemctl start bf-planning
```

### 7. Configurer nginx

```bash
sudo cp /opt/bf-planning/deploy/nginx-bf-planning.conf /etc/nginx/sites-available/bf-planning
sudo ln -s /etc/nginx/sites-available/bf-planning /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

> Adaptez `server_name` dans le fichier nginx si vous avez un nom de domaine.

## API

| Méthode | URL | Description |
|---------|-----|-------------|
| GET | `/api/schedule/:year/:month` | Retourne les données du mois |
| POST | `/api/schedule/:year/:month` | Sauvegarde (header `x-password` requis) |
| POST | `/api/auth` | Vérifie le mot de passe |
