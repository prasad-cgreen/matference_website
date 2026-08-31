# Cgreen website

The application consists of a React frontend and a FastAPI backend. MongoDB is
required for contact-form submissions.

## Local development

Use Node.js 24 and Python 3.12 or newer. From the repository root:

```powershell
npm run setup
npm run dev
```

`npm run setup` uses the pinned Yarn 1.22.22 dependency graph for the frontend
and creates `backend/.venv` for Python dependencies. Do not run `npm install`
inside `frontend`; that package is intentionally managed by Yarn because its
dependency resolutions are recorded in `frontend/yarn.lock`.

The services are available at:

- Frontend: http://localhost:3000
- Backend health endpoint: http://127.0.0.1:8000/api/

Without `backend/.env`, local MongoDB defaults are used. For a different MongoDB
instance, copy `backend/.env.example` to `backend/.env` and update its values.

Press Ctrl+C once in the development terminal to stop both services.
The frontend reloads automatically. Restart `npm run dev` after backend code
changes; backend auto-reload is disabled by default for compatibility with
Python 3.14 on Windows.

## Production

See [DEPLOYMENT.md](DEPLOYMENT.md) for Docker build and runtime configuration.
