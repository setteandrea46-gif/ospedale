# MedCard

MedCard è una cartella clinica personale digitale con frontend React + Tailwind CSS + Three.js e backend Node.js + PostgreSQL.

## Architettura

- `frontend/` — app React con UI responsive, schede cliniche, visualizzatore 3D e QR d'emergenza.
- `backend/` — API REST con autenticazione JWT, crittografia dati sensibili e PostgreSQL.

## Tecnologia

- Frontend: React, Vite, Tailwind CSS, React Router
- 3D: Three.js
- Backend: Node.js, Express, PostgreSQL, bcrypt, JWT, crypto

## Avvio

### Con Docker

1. Avvia Docker Desktop.
2. Copia `.env.example` in `.env` e imposta password locali.
3. Dalla cartella principale del progetto:
   - `docker compose up -d --build`
4. Apri:
   - Frontend: `http://localhost:5173`
   - Backend health check: `http://localhost:4000/health`
   - pgAdmin: `http://localhost:5050`

Credenziali pgAdmin:

- email: valore di `PGADMIN_DEFAULT_EMAIL`
- password: valore di `PGADMIN_DEFAULT_PASSWORD`

Per collegare pgAdmin al database usa:

- host: `db`
- port: `5432`
- database: valore di `POSTGRES_DB`
- user: valore di `POSTGRES_USER`
- password: valore di `POSTGRES_PASSWORD`

Il server `MedCard DB` viene gia importato in pgAdmin; se chiede la password usa il valore di `POSTGRES_PASSWORD`.

Per fermare tutto: `docker compose down`.

### Senza Docker

1. Copia `.env.example` in `backend/.env` e imposta i valori.
2. Da `backend/`
   - `npm install`
   - `npm run dev`
3. Da `frontend/`
   - `npm install`
   - `npm run dev`

## Funzionalità principali

- autenticazione sicura con JWT
- profilo medico e anagrafica
- emergenza QR pubblico
- archivio referti con upload
- calendario visite
- gestione farmaci e terapie
- parametri vitali con grafici
- registro vaccinazioni
- visualizzazione 3D corpo umano
- crittografia dei dati sensibili lato server
- access logs e privacy GDPR
