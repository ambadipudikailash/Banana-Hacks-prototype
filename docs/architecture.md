# System Architecture

## Overview
Visual Reverse Engineering is an AI-powered platform designed to analyze visual inputs (screenshots, diagrams, images, physical object photos) and extract an interactive, structured representation of the underlying system.

## Repository Structure & Separation of Ownership

The repository strictly enforces a clear separation of ownership between backend/AI development and frontend/database development:

```text
main
├── krishna/backend-ai    (Backend + FastAPI + AI Engine)
└── kailash/frontend-db   (Frontend + Next.js + PostgreSQL DB)
```

### Krishna's Ownership (Backend & AI)
- **Framework**: FastAPI (Python)
- **API Design**: RESTful endpoints, OpenAPI schemas, validation via Pydantic.
- **AI Engine**: Gemini API integration, prompt engineering, vision analysis.
- **Reverse-Engineering Engine**: Extraction of components, relationships, behaviors, evidence, and uncertainty metrics.
- **Backend Testing**: Unit and integration tests for API endpoints and AI pipeline data transformations.

### Kailash's Ownership (Frontend & Database)
- **Framework**: Next.js (TypeScript) + Tailwind CSS
- **UI/UX**: Dashboard, upload interfaces, component trees, interaction graphs, 3D exploded viewer UI.
- **Database**: PostgreSQL schema design, migrations, and database integration.

## Conceptual Architecture & API Boundary

```text
Visual Input (Image / Screenshot / Diagram / URL)
                      │
                      ▼
             FastAPI Backend Endpoint
                      │
                      ▼
           Gemini Vision AI Engine
                      │
                      ▼
        Common System Representation (JSON)
          │                       │
          ▼                       ▼
   PostgreSQL Database     Next.js Frontend / Interactive Explorer
```

### Shared System Representation Schema

All domain adapters and visual reverse engineering processes produce output adhering to the common intermediate system representation:

```json
{
  "system": {
    "id": "system_id",
    "name": "Example System",
    "type": "website | physical | app | diagram | unknown"
  },
  "components": [
    {
      "id": "comp_01",
      "name": "Component Name",
      "type": "ui_element | mechanical_part | logical_block",
      "parent_id": null
    }
  ],
  "relationships": [
    {
      "source": "comp_01",
      "target": "comp_02",
      "type": "contains | connects_to | calls | triggers"
    }
  ],
  "behaviors": [],
  "evidence": [],
  "uncertainties": []
}
```

## Important Dependencies
- **Backend**: Python 3.10+, FastAPI, Pydantic, Google GenAI SDK (`google-genai`).
- **Frontend**: Node.js 18+, Next.js, React, Tailwind CSS, Three.js / React Three Fiber (for 3D viewer).
- **Database**: PostgreSQL.

## Current Implementation Status (Milestone 0)
- **Repository Setup**: Initialized Git repository with `AGENTS.md` rules and project build specs.
- **Git Branching**: Created `krishna/backend-ai` tracking branch.
- **Source Code**: Not yet initialized (Milestone 1 will establish backend structure and dependencies).
