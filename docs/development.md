# Development Guide

## Overview
This document outlines setup procedures, Git workflow, branch conventions, and testing instructions for developers working on the Visual Reverse Engineering project.

## Developer Branch Ownership & Git Workflow

### Long-lived Branches
```text
main
├── krishna/backend-ai    (Backend + AI Track)
└── kailash/frontend-db   (Frontend + Database Track)
```

### Git Rules
1. **Never commit directly to `main`**.
2. Work exclusively within your assigned track branch (`krishna/backend-ai` or `kailash/frontend-db`).
3. Coordinate merges through Pull Requests or planned integration syncs after review.
4. Do not delete or force push to long-lived developer branches.

---

## Environment Configuration

Copy `.env.example` to `.env` in the root/service directories before starting development:

```bash
cp .env.example .env
```

Ensure `GEMINI_API_KEY` is provided in `.env` for AI engine operations. Never commit `.env` to Git.

---

## Local Development Setup

### Backend Setup (Krishna Track)
*Prerequisites: Python 3.10+*

1. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows (PowerShell):
   .\venv\Scripts\Activate.ps1
   # On Linux/macOS:
   source venv/bin/activate
   ```
2. Install backend dependencies (when `requirements.txt` is introduced in Milestone 1):
   ```bash
   pip install -r requirements.txt
   ```
3. Run FastAPI backend server (Milestone 1 onwards):
   ```bash
   uvicorn backend.main:app --reload --port 8000
   ```

### Frontend Setup (Kailash Track)
*Prerequisites: Node.js 20.9+*

1. Copy the frontend's public configuration template:
   ```bash
   cp frontend/.env.example frontend/.env.local
   ```
2. Install Node dependencies:
   ```bash
   cd frontend
   npm ci
   ```
3. Run Next.js development server:
   ```bash
   npm run dev
   ```
4. Open the local URL printed by Next.js (normally `http://localhost:3000`).

---

## Testing Commands

### Backend Testing (Krishna Track)
- Run pytest suite (once tests are introduced):
  ```bash
  pytest
  ```

### Frontend Testing (Kailash Track)
- Run the available frontend checks:
  ```bash
  cd frontend
  npm run typecheck
  npm run build
  ```

---

## Developer Coordination Protocol
- **API Boundary**: Backend FastAPI schemas (`Pydantic` models) define the API contract with the frontend.
- **Shared Representation**: Changes to `system`, `components`, or `relationships` JSON structures must be agreed upon by both Krishna and Kailash before updating Pydantic models or frontend TypeScript interfaces.
