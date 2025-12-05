### NationalIDSystem — Merkle‑backed National ID registration for a voting project

This repository contains a full‑stack prototype for simulating a national ID registration flow used by a voting system. It incorporates a Merkle tree to maintain user identity commitments and uses encrypted secrets to help authenticate voters securely.

The system consists of:
- A Python/Flask backend that manages registration, email verification, secret storage, and Merkle tree operations (via LevelDB and Poseidon hash).
- A Next.js (React) frontend for user interactions (registration, verification, party management, etc.).
- A small Node.js helper (ESM) that generates a signature used during registration.


---

### Tech stack

- Backend
    - Python 3.11+ (recommended)
    - Flask (+ CORS)
    - MySQL (via `flask_mysqldb`)
    - LevelDB (via `plyvel`)
    - Poseidon hash (`circomlibpy`)
    - Email via SMTP (Gmail example)

- Frontend
    - Next.js 15
    - React 19
    - TailwindCSS (+ shadcn/ui, lucide-react, framer-motion)

- Helper (Merkle/signature)
    - Node.js (ESM)
    - `circomlib`, `circomlibjs`, `ffjavascript`, `dotenv`


---

### Project structure

```
C:/Users/Jabir/PycharmProjects/NationalIDSystem
├─ routes.py                     # Flask app entry point (backend API)
├─ MYSQL_connections.py          # (Present) MySQL-related helpers (if used)
├─ utilities/
│  └─ send_email.py              # SMTP email sending (HTML templated)
├─ merkletreeids/
│  ├─ MerkleTree.py              # LevelDB-backed Merkle tree (Poseidon)
│  ├─ RegisterCitizens.py        # Registration + signature generation
│  ├─ GenSign.js                 # Node script invoked by Python (ESM)
│  ├─ package.json               # Node helper dependencies
│  └─ ... (leveldb sources, helpers)
├─ ids_tree/                     # LevelDB data directory (configured by MERKLE_PATH)
├─ frontend/                     # Next.js app (frontend)
│  ├─ package.json               # Frontend scripts and deps
│  └─ src/...
├─ .env                          # Example environment variables
└─ README.md                     # This file
```


---

### Backend overview (Flask)

Main app: `routes.py`

Key endpoints (selection):
- `POST /register` — Create user record and send email verification code.
- `POST /verify_email` — Verify the emailed code; on success, register the voter in the Merkle tree and return secrets (`sid`, `nullifier`, signature parts).
- `POST /save_secrets` — Persist client‑side encrypted secrets (AES data) in DB.
- `POST /send_verification_code` — Send a new email verification code and set expiry.
- `POST /verify_match` — Confirm an email and national ID pair (only for verified users).
- `GET  /voter_info?id=...` — Return Merkle path and stored secret for a given national ID.
- `GET  /merkle_root` — Return current Merkle root (hex) of the ID tree.
- Party management: `POST /add_party`, `GET /is_party_exist`, `POST /verify_party`.

Merkle tree implementation:
- `merkletreeids/MerkleTree.py` uses LevelDB via `plyvel` to store leaves and internal nodes.
- Hashing uses Poseidon (`circomlibpy`).
- Tree height currently assumes 20 levels (paths padded to 20).
- Leaves are Poseidon commitments of `(official_id, PUBLIC_SALT)`.

Signature generation:
- `RegisterCitizens.register_voter()` calls `GenSign.js` (Node) via `subprocess` to produce signature fields written to `merkletreeids/sig_input.json`, which are returned with `sid` and `nullifier`.


---

### Frontend overview (Next.js)

Located in `frontend/`, based on Next.js 15 and React 19 with TailwindCSS and shadcn/ui. Pages include registration (`/register`), verification (`/verify`), party flows (e.g., `/add-party`).

Frontend relies on the backend API (Flask) running locally (default: `http://localhost:5000`).


---

### Requirements

System prerequisites:
- Python 3.11+ (3.10+ may work)
- Node.js 18+ (20+ recommended)
- MySQL Server 8.x (or compatible)
- LevelDB native library (required by `plyvel`)

Python packages (no root `requirements.txt` yet):
- `Flask`, `flask-cors`, `flask-mysqldb`
- `python-dotenv`
- `nanoid`, `shortuuid`
- `plyvel`
- `circomlibpy`

Node packages:
- Frontend: managed in `frontend/package.json`
- Merkle helper: managed in `merkletreeids/package.json` (ESM)


---

### Environment variables

Backend loads environment via `os.getenv(...)`. Example `.env` values in repo root:



Notes:
- `MERKLE_PATH` points to the LevelDB directory for the Merkle tree. On non‑Windows systems, set it to a valid path like `/path/to/ids_tree`.
- Gmail SMTP requires an App Password when 2FA is enabled.


---

### Setup

1) Clone this repository
```
git clone <this-repo-url>
cd NationalIDSystem
```

2) Create and fill `.env`
```
cp .env .env.local  # optional; you may keep using .env
# Edit values to match your local MySQL and desired MERKLE_PATH
```

3) Backend — Python environment
```
python -m venv .venv
.venv\Scripts\activate         # Windows
# source .venv/bin/activate     # macOS/Linux

pip install --upgrade pip
pip install Flask flask-cors flask-mysqldb python-dotenv nanoid shortuuid plyvel circomlibpy

# Ensure LevelDB is installed on your system so that plyvel can work.
```

4) Frontend — Node dependencies
```
cd frontend
npm install
cd ..
```

5) Merkle helper — Node dependencies
```
cd merkletreeids
npm install
cd ..
```

6) MySQL database
- Create a database matching `DB_NAME` and required tables: `users`, `secrets`, `parties`.
- Columns inferred from the code (you may adapt types to your needs):
    - `users(name, phone_number, email, birth_place, age, sex, ID, email_verification_code, email_code_expire, verified)`
    - `secrets(id, secret, iv, salt)`
    - `parties(ID, party_name, leader_email, leader_ID, short_name)`

TODO: Provide exact schema DDLs once finalized.


---

### Running

Backend (Flask):
```
# from repo root (with venv activated)
python routes.py
# By default: http://localhost:5000
```

Frontend (Next.js):
```
cd frontend
npm run dev
# Next.js dev server (default): http://localhost:3000
```


---

### Scripts

Frontend (`frontend/package.json`):
- `npm run dev` — Start Next.js dev server (Turbopack)
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — Run Next.js ESLint

Merkle helper (`merkletreeids/package.json`):
- Currently only a placeholder `test` script. The file `GenSign.js` is executed by Python via `subprocess` and does not need a direct npm script. Ensure `npm install` is run in `merkletreeids/` before backend usage.


---

### Environment and data notes

- Merkle data is stored in LevelDB under `MERKLE_PATH` (e.g., `ids_tree/`). Deleting that directory resets the tree.
- `MerkleTreeDB.clear_db()` exists but no CLI script is provided to call it.
- `RegisterCitizens.py` calls `node` directly; ensure `node` is in your `PATH`. On Windows this is typically automatic after installing Node.js.


---




### Security considerations

- Secrets are client‑side encrypted before being stored by the backend; review `frontend/src/utilities/*` for cryptographic helpers.
- Email verification codes expire after 5 minutes.
- Poseidon hash and Merkle paths are used to avoid storing plain IDs as leaves.
- Always store credentials (DB, SMTP) outside of version control and rotate them when needed.


---

### Troubleshooting

- `plyvel` import or runtime errors:
    - Ensure LevelDB is installed on your system and accessible to Python.
    - Verify `MERKLE_PATH` points to a writable directory.

- `Node` not found when registering voters:
    - Install Node.js and ensure `node` is in your `PATH`.
    - Run `npm install` in `merkletreeids/`.

- MySQL connection errors:
    - Check `.env` DB settings; ensure the DB and tables exist.
    - Verify user credentials and host/port.


---



### Roadmap / TODOs

- [ ] Provide database schema migrations (SQL DDL) and seed data.
- [ ] Create `requirements.txt` for the backend.
- [ ] Add npm scripts for the helper (`merkletreeids`) if direct CLI usage becomes necessary.
- [ ] Add Dockerfiles/docker-compose for easier setup of Flask, Next.js, and MySQL.
- [ ] Implement automated tests (backend/frontend) and CI.
