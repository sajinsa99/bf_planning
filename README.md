# bf_planning

Calendrier mensuel de planning pour indiquer qui est de service (Yann ou Bruno) le matin et le soir chaque jour du mois.

## Fonctionnement

- **Mode vue** (public) : affiche le calendrier du mois en cours, navigation entre les mois
- **Mode édition** (protégé par mot de passe) : cliquez sur un créneau pour faire tourner l'assignation — vide → Yann → Bruno → vide

## Déploiement sur Ubuntu 24.04

```bash
git clone <repo-url> bf_planning
cd bf_planning
vi /opt/bf_planning/.env   # créer le fichier .env (voir ci-dessous)
./install.sh
```

Contenu du fichier `.env` :

```
APP_PASSWORD=votre-mot-de-passe-secret
PORT=3000
```

> Adaptez `server_name` dans [deploy/nginx-bf_planning.conf](deploy/nginx-bf_planning.conf) si vous avez un nom de domaine, avant de lancer `install.sh`.

## Structure du projet

```
bf_planning/
├── server.js                  # Backend Express
├── package.json
├── install.sh                 # Script de déploiement
├── .env                       # APP_PASSWORD, PORT (non versionné, à créer)
├── data/                      # Fichiers JSON par mois (non versionnés)
│   └── 2026-04.json           # { "1": { "morning": "Yann", "evening": null }, ... }
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
└── deploy/
    ├── bf_planning.service    # Unité systemd
    └── nginx-bf_planning.conf
```

## API

| Méthode | URL | Description |
|---------|-----|-------------|
| GET | `/api/schedule/:year/:month` | Retourne les données du mois |
| POST | `/api/schedule/:year/:month` | Sauvegarde le mois (header `x-password` requis) |
| POST | `/api/auth` | Vérifie le mot de passe |
