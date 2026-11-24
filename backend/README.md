# Rootline backend (FastAPI)

```bash
cd backend
uv sync                                   # install deps into .venv
uv run uvicorn app.main:app --reload      # http://localhost:8000, docs at /docs
uv run pytest                             # tests
```

| Endpoint | Purpose |
| --- | --- |
| `GET /api/health` | Liveness, and whether a model is loaded |
| `POST /api/diagnose` | Multipart `whole_plant` + `leaf_underside` images. Returns a **mock** result until the CNN is trained (see `documentation/CNN_SETUP.md`) |

Settings are read from env vars with the `ROOTLINE_` prefix, or from `backend/.env` (see `app/config.py`). CORS allows the Vite dev and preview ports by default.
