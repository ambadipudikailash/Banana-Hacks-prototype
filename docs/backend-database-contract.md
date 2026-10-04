# Backend Database Contract

## Purpose
This document defines the formal data contract between Krishna's Backend/AI Engine and Kailash's Database & Persistence Layer for Milestone 2. It ensures that analysis results produced by the backend can be persisted cleanly in PostgreSQL without altering domain semantics or invalidating API contracts.

---

## System Data
The system entity represents the top-level analyzed subject.

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | String | Yes | Unique system identifier |
| `name` | String | Yes | Human-readable system name |
| `type` | Enum (String) | Yes | System domain: `website`, `physical`, `app`, `diagram`, `unknown` |
| `description` | String | No | Optional brief explanation of the system |

---

## Components
Components represent individual functional, UI, or mechanical parts extracted during reverse engineering.

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | String | Yes | Unique component identifier |
| `name` | String | Yes | Name of the component |
| `type` | String | Yes | Component classification e.g. `ui_element`, `mechanical_part`, `module` |
| `parent_id` | String | No | Parent component ID for hierarchical nesting |
| `confidence` | Float | No | Detection confidence metric between `0.0` and `1.0` |
| `metadata` | Object (JSON) | No | Key-value pairs for arbitrary component attributes |

---

## Relationships
Relationships define dependencies, interactions, or structural connections between components.

| Field | Type | Required | Description |
|---|---|---|---|
| `source` | String | Yes | Source component ID |
| `target` | String | Yes | Target component ID |
| `type` | String | Yes | Relationship type e.g. `contains`, `connects_to`, `calls`, `triggers` |
| `description` | String | No | Optional text describing the interaction |
| `confidence` | Float | No | Relationship confidence score between `0.0` and `1.0` |

---

## Behaviors
Behaviors detail observed or inferred operational capabilities of the system.

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | String | Yes | Unique behavior identifier |
| `description` | String | Yes | Functional description of the behavior |
| `trigger` | String | No | Event or condition triggering the behavior |
| `action` | String | No | Resulting action or system state change |

---

## Evidence
Evidence captures visual regions or textual references supporting reverse-engineering inferences.

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | String | Yes | Unique evidence identifier |
| `description` | String | Yes | Explanation of the visual/textual evidence |
| `source_location` | String | No | Bounding box or image region coordinate reference |

---

## Uncertainties
Uncertainties explicitly track unverified components, missing information, or speculative assumptions.

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | String | Yes | Unique uncertainty identifier |
| `description` | String | Yes | Explanation of what is unverified or uncertain |
| `target_id` | String | No | ID of affected component or relationship if applicable |
| `score` | Float | No | Uncertainty score from `0.0` (low) to `1.0` (high) |

---

## Analysis Metadata
Metadata associated with a specific reverse-engineering analysis run.

| Field | Type | Required | Description |
|---|---|---|---|
| `analysis_id` | String / UUID | Yes | Unique identifier for the analysis run |
| `created_at` | Timestamp (ISO 8601) | Yes | UTC timestamp when analysis completed |
| `version` | String | Yes | Backend schema version (e.g. `1.0.0`) |
| `status` | String | Yes | Run status e.g. `completed`, `failed`, `pending` |

---

## JSON Representation Example
Below is a complete JSON document matching `backend/app/schemas/system.py` (`SystemRepresentation`):

```json
{
  "system": {
    "id": "sys_drone_01",
    "name": "Quadcopter Drone",
    "type": "physical",
    "description": "Exploded hardware view of a lightweight drone"
  },
  "components": [
    {
      "id": "comp_frame",
      "name": "Carbon Fiber Frame",
      "type": "structural_part",
      "parent_id": null,
      "confidence": 0.98,
      "metadata": {
        "material": "carbon_fiber",
        "weight_g": "150"
      }
    },
    {
      "id": "comp_motor_01",
      "name": "Brushless Motor 01",
      "type": "mechanical_part",
      "parent_id": "comp_frame",
      "confidence": 0.95,
      "metadata": {
        "kv_rating": "2300KV"
      }
    }
  ],
  "relationships": [
    {
      "source": "comp_frame",
      "target": "comp_motor_01",
      "type": "contains",
      "description": "Frame holds Motor 01 mounted on Arm 1",
      "confidence": 0.99
    }
  ],
  "behaviors": [
    {
      "id": "beh_thrust",
      "name": "Thrust Generation",
      "description": "Motors spin propellers to produce vertical lift",
      "trigger": "Throttle input > 10%",
      "action": "Proportional motor RPM increase"
    }
  ],
  "evidence": [
    {
      "id": "ev_01",
      "description": "Visible motor housing and propeller shaft on arm",
      "source_location": "bbox:[120,45,200,110]"
    }
  ],
  "uncertainties": [
    {
      "id": "unc_01",
      "description": "Internal motor winding coil specification is unverified",
      "target_id": "comp_motor_01",
      "score": 0.35
    }
  ]
}
```

---

## Database Integration Rules
1. **API Contract Authority**: The backend Pydantic models in `backend/app/schemas/system.py` remain the authoritative source of truth for API request/response structures.
2. **PostgreSQL Storage Strategy**: Storing the full `SystemRepresentation` payload inside a PostgreSQL `JSONB` column (e.g. `analysis_runs.result`) is strongly recommended for initial persistence to prevent rigid table normalization and support flexible schema iteration.
3. **No Semantic Alteration**: Database schema columns or ORM transformations must not silently strip, mutate, or rename backend JSON fields.
4. **Validation**: All data persisted into the database or retrieved for API responses must pass Pydantic validation.

---

## Compatibility Rules
1. **Non-Breaking Schema Additions**: New fields added to `SystemRepresentation` in future milestones will include default values (`None` or empty lists/dicts) to preserve database backward compatibility.
2. **Field Deprecation**: No mandatory fields will be removed without a formal schema version bump.
