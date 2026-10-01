# Banana-Hacks-prototype

REVERSEX AI — MASTER BUILD SPECIFICATION
Source of Truth • Phase-by-Phase Implementation Plan • Architecture & AI Hallucination Guardrail
Document Version: 2.0.0
Status: APPROVED ENGINEERING CONTRACT
Target Platform: Web (Next.js 14+ / FastAPI)
Author: Lead Software Architect

0. HOW TO USE THIS DOCUMENT
This document is the Single Source of Truth for the entire ReverseX AI project.

Every developer and AI coding agent must follow this specification strictly:

No Silent Architecture Changes: You must not change API routes, data structures, state management patterns, or execution flow unless this specification is explicitly updated first.
No Fake Implementations: Do not stub out core 3D generation, mock AI responses, or simulate job completion without executing the defined pipeline logic.
Phase-by-Phase Execution: Tasks must be implemented in the exact numerical order of the defined Development Phases. Do not jump ahead to UI polish before backend services and API contracts are verified.
Validation First: A phase is complete ONLY when all its completion criteria, schema validations, and unit/integration tests pass.
text

       +-------------------------------------------------------+
       |             MASTER BUILD SPECIFICATION               |
       |                (Source of Truth)                      |
       +---------------------------+---------------------------+
                                   |
                                   v
       +-------------------------------------------------------+
       |               CURRENT PHASE EXECUTION                 |
       +---------------------------+---------------------------+
                                   |
                                   v
       +-------------------------------------------------------+
       |          IMPLEMENTATION & CODE GENERATION             |
       +---------------------------+---------------------------+
                                   |
                                   v
       +-------------------------------------------------------+
       |            VERIFICATION & SCHEMA TEST                 |
       +---------------------------+---------------------------+
                                   |
                                   v
       +-------------------------------------------------------+
       |           MARK PHASE DONE -> NEXT PHASE               |
       +-------------------------------------------------------+
1. PROJECT DEFINITION & CORE ACCURACY PRINCIPLES
1.1 Project Name
ReverseX AI

1.2 One-Line Definition
ReverseX AI is an AI-assisted visual reverse-engineering platform that ingests multiple photographs of a physical object, validates image coverage, performs visual structure and component breakdown using multimodal AI, triggers asynchronous approximate 3D reconstruction, links semantic components to 3D surface hotspots, and presents an interactive reverse-engineering report.

1.3 Strict Accuracy Rule
A photograph cannot reveal internal hidden mechanics or exact physical dimensions with absolute certainty. The platform explicitly classifies all analysis data into three rigid evidence tiers:

detected: Directly visible in at least one uploaded photograph with verifiable visual boundaries.
inferred: Deduced based on physical function, engineering standards, or visible external connections, but not directly visible.
unknown: Insufficient evidence to identify or confirm function or geometry.
text

+-------------------+---------------------------------------------------+
| EVIDENCE TIER     | CONDITION                                         |
+-------------------+---------------------------------------------------+
| detected          | Visible surface boundaries in photo               |
| inferred          | Logical engineering deduction (hidden component)  |
| unknown           | No optical or structural evidence available       |
+-------------------+---------------------------------------------------+
1.4 Forbidden Claims (Engineering Guardrails)
Unless verified by external hardware tools or manual overrides, the system MUST NEVER claim or output:

Exact engineering CAD models (.step, .igs) as raw photogrammetry output.
Exact dimensional tolerances (e.g., ±0.02mm) without a physical scale calibration marker in photos.
Guaranteed internal component geometry (e.g., exact tooth counts on enclosed planetary gears).
Exact material alloy composition (e.g., Aluminum 6061-T6 vs Aluminum 7075) based purely on visual pixels.
Exact electrical circuit diagrams or hidden PCB traces.
The system MUST state uncertainty and present all outputs as visual reverse-engineering approximations.

2. REQUIRED SYSTEM FLOW & TRANSITION LOGIC
The system executes the following linear workflow. Each transition is governed by strict inputs and outputs:

text

PHYSICAL OBJECT
      ↓
MULTIPLE PHOTOS (3-8 Images)
      ↓
[Phase 2] UPLOAD ENGINE (Multipart FormData)
      ↓
[Phase 3] IMAGE VALIDATION & COVERAGE ENGINE (Blur, Lighting, Angle Coverage)
      ↓
[Phase 4] ASYNCHRONOUS JOB INITIATION (Returns job_id)
      ↓
[Phase 6] OBJECT IDENTIFICATION (Name, Category, Overview)
      ↓
[Phase 7] COMPONENT IDENTIFICATION (Detected / Inferred / Unknown List)
      ↓
[Phase 8] RELATIONSHIP ENGINE (Dependency & Functional Graph)
      ↓
[Phase 9] 3D RECONSTRUCTION PIPELINE (Primary AI/Photogrammetry -> Fallback Hierarchy -> GLB)
      ↓
[Phase 10] 3D ASSET PROCESSING (Scale, Center, Compress, Extract Coordinates)
      ↓
[Phase 12] SPATIAL HOTSPOT MAPPING (Associate 3D Surface Pins with Component IDs)
      ↓
[Phase 17] REVERSE ENGINEERING REPORT GENERATION (Markdown + JSON Synthesis)
      ↓
[Phases 11-19] INTERACTIVE DASHBOARD (3D Viewer + Explorer + Graph + Report)
Transition Contracts:
Upload → Validation: Accepts raw files → Validates format, size, blur (Laplacian variance > 100), exposure, and viewpoint spread.
Validation → Job Queue: Valid images passed → FastAPI generates UUID job_id, persists images to disk (storage/uploads/{job_id}/), creates status JSON, returns 202 Accepted.
Job Queue → Vision Processing: Background task invokes Multimodal Vision AI with structured JSON Schema prompt → Receives Object ID, Components, Relationships, Materials.
Vision Processing → 3D Pipeline: Valid components received → 3D engine triggered asynchronously using images → Generates model.glb via Primary API / Local AI generator / Fallback.
3D Model → Spatial Hotspot Mapping: model.glb analyzed for surface bounds → Coordinates (x, y, z) calculated for detected components → Hotspot mapping list populated.
Job Completion → Frontend Render: Job status updated to completed → Frontend polling detects completion → Requests /api/jobs/{job_id}/result → Renders interactive dashboard.
3. SYSTEM ARCHITECTURE
ReverseX AI uses a decoupled Frontend/Backend architecture connected via REST APIs and asynchronous polling.

text

+-----------------------------------------------------------------------+
|                            FRONTEND (Client)                          |
|                                                                       |
|   Next.js 14+ (App Router, SPA mode)  •  TypeScript  •  Tailwind CSS  |
|   shadcn/ui  •  Framer Motion  •  TanStack Query (Async Polling)       |
|   Three.js  •  React Three Fiber (R3F)  •  @react-three/drei          |
+-----------------------------------+-----------------------------------+
                                    |
                            HTTP REST / JSON
                                    |
+-----------------------------------+-----------------------------------+
|                            BACKEND (Server)                           |
|                                                                       |
|   FastAPI (Python 3.11+)  •  Pydantic v2 Validation                  |
|   Async Background Tasks (FastAPI BackgroundTasks / ARQ Worker)       |
|   Pillow / OpenCV (Image Validation)                                  |
|   Vision AI Integrations (OpenAI / Gemini Vision APIs)                |
|   3D Reconstruction Handlers (Tripo3D / Meshy API / InstantMesh)      |
|   Local Disk Storage Manager (`storage/uploads/` & `storage/models/`) |
+-----------------------------------------------------------------------+
Component Responsibility Separation:
Frontend Responsibilities: Image drag-and-drop, upload queue UI, stateful progress polling, interactive 3D mesh rendering, 3D hotspot raycasting & html annotation rendering, state synchronization, component selection highlight, dynamic relationship graph rendering, responsive report layout.
Backend Responsibilities: Multipart request parsing, magic-byte file validation, image quality heuristics, AI prompt construction, structured JSON enforcement, long-running job state management, 3D generation orchestration, GLB post-processing, static asset serving, rate limiting, and API key protection.
4. ASYNCHRONOUS JOB PROCESSING ENGINE
3D reconstruction and Vision AI analysis require between 15 to 120 seconds. Synchronous HTTP execution is forbidden.

4.1 API Endpoint Definitions
1. Initiate Job
POST /api/analyze
Request: multipart/form-data containing images (1 to 8 files).
Response: 202 Accepted
json

{
  "job_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "status": "queued",
  "created_at": "2026-09-30T20:00:00Z",
  "message": "Analysis job created successfully. Poll status endpoint for progress."
}
2. Poll Job Status
GET /api/jobs/{job_id}
Response: 200 OK
json

{
  "job_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "status": "generating_3d",
  "progress_percentage": 65,
  "current_step": "Generating 3D textured mesh from multi-view inputs",
  "error": null,
  "updated_at": "2026-09-30T20:00:45Z"
}
3. Fetch Job Result
GET /api/jobs/{job_id}/result
Response: 200 OK (Returns full AnalysisResult schema defined in Section 5).
Error: 404 Not Found if job incomplete or non-existent.
4.2 Allowed Job States
text

queued → validating_images → analyzing_object → analyzing_components → analyzing_relationships → generating_3d → processing_model → mapping_components → generating_report → completed
                                                                                                                                                                  ↓ (On Error)
                                                                                                                                                                failed
4.3 Progress Percentage Rules
queued: 5%
validating_images: 15%
analyzing_object: 25%
analyzing_components: 40%
analyzing_relationships: 50%
generating_3d: 70%
processing_model: 85%
mapping_components: 90%
generating_report: 95%
completed: 100%
failed: Progress frozen, error message populated.
5. API CONTRACT & SCHEMAS
Frontend and backend MUST share identical schema interfaces. Pydantic models govern backend serialization; TypeScript interfaces govern frontend rendering.

5.1 Python Pydantic Models (backend/app/schemas/analysis.py)
python

from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, HttpUrl
class ComponentStatus(str, Enum):
    DETECTED = "detected"
    INFERRED = "inferred"
    UNKNOWN = "unknown"
class JobState(str, Enum):
    QUEUED = "queued"
    VALIDATING_IMAGES = "validating_images"
    ANALYZING_OBJECT = "analyzing_object"
    ANALYZING_COMPONENTS = "analyzing_components"
    ANALYZING_RELATIONSHIPS = "analyzing_relationships"
    GENERATING_3D = "generating_3d"
    PROCESSING_MODEL = "processing_model"
    MAPPING_COMPONENTS = "mapping_components"
    GENERATING_REPORT = "generating_report"
    COMPLETED = "completed"
    FAILED = "failed"
class Coordinates3D(BaseModel):
    x: float = Field(..., description="X coordinate in model space meters")
    y: float = Field(..., description="Y coordinate in model space meters")
    z: float = Field(..., description="Z coordinate in model space meters")
class Hotspot(BaseModel):
    id: str = Field(..., description="Unique hotspot identifier")
    component_id: str = Field(..., description="ID of associated component")
    label: str = Field(..., description="Short text label for 3D overlay")
    position: Coordinates3D
    normal: Optional[Coordinates3D] = None
class Component(BaseModel):
    id: str = Field(..., description="Kebab-case unique identifier")
    name: str = Field(..., description="Human-readable name")
    status: ComponentStatus
    confidence: float = Field(..., ge=0.0, le=1.0)
    function: str = Field(..., description="Primary mechanical/electrical purpose")
    evidence: str = Field(..., description="Visual or structural rationale")
    source_images: List[str] = Field(default_factory=list, description="Filenames showing this component")
    estimated_material: Optional[str] = None
    submesh_id: Optional[str] = None
class Relationship(BaseModel):
    source_component_id: str
    target_component_id: str
    relation_type: str = Field(..., description="e.g. 'drives', 'houses', 'fastens', 'connects_electrically'")
    description: str
class MaterialEstimation(BaseModel):
    component_id: str
    material_name: str
    category: str = Field(..., description="Polymer, Ferrous Metal, Non-Ferrous Metal, Composite, Rubber, Glass, Unknown")
    visual_indicators: List[str]
    confidence: float = Field(..., ge=0.0, le=1.0)
class ModelMetadata(BaseModel):
    model_url: str = Field(..., description="Relative or absolute URL to download object.glb")
    format: str = "glb"
    vertex_count: int
    face_count: int
    is_fallback: bool = Field(False, description="True if standard asset fallback was used")
    bounding_box_dimensions: Coordinates3D
class ObjectMetadata(BaseModel):
    name: str
    category: str
    estimated_use: str
    overall_confidence: float = Field(..., ge=0.0, le=1.0)
    summary: str
class ReverseEngineeringReport(BaseModel):
    executive_summary: str
    working_principle: str
    assembly_hierarchy: List[str]
    probable_manufacturing_methods: List[str]
    design_observations: List[str]
class JobStatusResponse(BaseModel):
    job_id: str
    status: JobState
    progress_percentage: int
    current_step: str
    error: Optional[str] = None
class AnalysisResult(BaseModel):
    analysis_id: str
    job_id: str
    object: ObjectMetadata
    components: List[Component]
    relationships: List[Relationship]
    materials: List[MaterialEstimation]
    model: ModelMetadata
    hotspots: List[Hotspot]
    report: ReverseEngineeringReport
    limitations: List[str]
    created_at: str
5.2 TypeScript Interfaces (frontend/src/types/analysis.ts)
typescript

export type ComponentStatus = 'detected' | 'inferred' | 'unknown';
export type JobState =
  | 'queued'
  | 'validating_images'
  | 'analyzing_object'
  | 'analyzing_components'
  | 'analyzing_relationships'
  | 'generating_3d'
  | 'processing_model'
  | 'mapping_components'
  | 'generating_report'
  | 'completed'
  | 'failed';
export interface Coordinates3D {
  x: number;
  y: number;
  z: number;
}
export interface Hotspot {
  id: string;
  component_id: string;
  label: string;
  position: Coordinates3D;
  normal?: Coordinates3D;
}
export interface Component {
  id: string;
  name: string;
  status: ComponentStatus;
  confidence: number; // 0.0 to 1.0
  function: string;
  evidence: string;
  source_images: string[];
  estimated_material?: string;
  submesh_id?: string;
}
export interface Relationship {
  source_component_id: string;
  target_component_id: string;
  relation_type: string;
  description: string;
}
export interface MaterialEstimation {
  component_id: string;
  material_name: string;
  category: string;
  visual_indicators: string[];
  confidence: number;
}
export interface ModelMetadata {
  model_url: string;
  format: 'glb' | 'gltf';
  vertex_count: number;
  face_count: number;
  is_fallback: boolean;
  bounding_box_dimensions: Coordinates3D;
}
export interface ObjectMetadata {
  name: string;
  category: string;
  estimated_use: string;
  overall_confidence: number;
  summary: string;
}
export interface ReverseEngineeringReport {
  executive_summary: string;
  working_principle: string;
  assembly_hierarchy: string[];
  probable_manufacturing_methods: string[];
  design_observations: string[];
}
export interface JobStatusResponse {
  job_id: string;
  status: JobState;
  progress_percentage: number;
  current_step: string;
  error?: string;
}
export interface AnalysisResult {
  analysis_id: string;
  job_id: string;
  object: ObjectMetadata;
  components: Component[];
  relationships: Relationship[];
  materials: MaterialEstimation[];
  model: ModelMetadata;
  hotspots: Hotspot[];
  report: ReverseEngineeringReport;
  limitations: string[];
  created_at: string;
}
6. COMPONENT METADATA SCHEMA & CLASSIFICATION RULES
Every extracted component must undergo mandatory backend classification logic:

python

def validate_component_status(component: Component) -> Component:
    # Rule 1: Detected components MUST have non-empty source images and visual evidence
    if component.status == ComponentStatus.DETECTED:
        if not component.source_images or len(component.evidence) < 10:
            component.status = ComponentStatus.INFERRED
            component.evidence += " (Downgraded to inferred: Insufficient direct visual bounding evidence)"
    
    # Rule 2: Inferred components cannot claim confidence > 0.85
    if component.status == ComponentStatus.INFERRED:
        if component.confidence > 0.85:
            component.confidence = 0.85
            
    # Rule 3: Unknown components must have confidence <= 0.40
    if component.status == ComponentStatus.UNKNOWN:
        component.confidence = min(component.confidence, 0.40)
        
    return component
7. 3D RECONSTRUCTION PIPELINE & FALLBACK HIERARCHY
Reconstructing 3D geometry from 3–8 unstructured images is a high-risk technical challenge. The system enforces a Rigid Fallback Hierarchy to guarantee that the application NEVER fails during a live demo or API execution.

text

                   +-----------------------------------+
                   |     3D GENERATION INITIATED       |
                   +-----------------+-----------------+
                                     |
                                     v
                   +-----------------------------------+
                   |   PRIMARY: Cloud AI 3D API        |
                   |   (Tripo3D / Meshy / Rodin API)   |
                   +-----------------+-----------------+
                                     |
                          [Success]  |  [Timeout / API Error / Failure]
                    +----------------+----------------+
                    |                                 |
                    v                                 v
         +--------------------+            +-----------------------------------+
         | Return Custom GLB  |            |   SECONDARY: Local AI Generator   |
         +--------------------+            |   (InstantMesh / SF3D PyTorch)    |
                                           +-----------------+-----------------+
                                                             |
                                                  [Success]  |  [CUDA OOM / Fail]
                                            +----------------+----------------+
                                            |                                 |
                                            v                                 v
                                 +--------------------+            +-----------------------------------+
                                 | Return Custom GLB  |            |  TERTIARY FALLBACK: Preprocessed  |
                                 +--------------------+            |  Reference CAD GLB Asset Store    |
                                                                   +-----------------+-----------------+
                                                                                     |
                                                                                     v
                                                                           +-------------------+
                                                                           | Return Class GLB  |
                                                                           | (is_fallback=true)|
                                                                           +-------------------+
7.1 Fallback Rules & Behavior
Primary Method (Cloud AI Multi-View 3D API): The backend submits the image set to an external API (e.g., Tripo3D API POST /v2/openapi/task or Meshy API). Timeout limit: 45 seconds.
Secondary Method (Local AI Inference / Photogrammetry): If Primary API fails or is unconfigured (TRIPO_API_KEY missing), the backend attempts local execution of InstantMesh / SF3D via Python subprocess. Timeout limit: 60 seconds.
Tertiary Fallback (Reference CAD Asset Store): If both primary and secondary fail, the backend selects a high-quality pre-processed reference .glb asset based on the object's identified category (e.g., drill.glb, keyboard.glb, fan.glb, generic_device.glb).
Mandatory Flag: The backend sets model.is_fallback = true in the API response.
UI Disclosure: The frontend MUST display a visual warning banner: "Approximate reference geometry displayed. Direct multi-view 3D reconstruction encountered low visual coverage."
8. COMPONENT-TO-3D SPATIAL MAPPING (HOTSPOTS)
Photogrammetry and AI multi-view generation produce monolithic single-mesh GLB files (Mesh_0). They DO NOT produce separate, selectable sub-mesh objects.

8.1 3D Hotspot Strategy
To map semantic components to the 3D model, ReverseX AI uses 3D Surface Hotspot Anchors.

text

           [ 3D Viewer Mesh (object.glb) ]
                         |
      +------------------+------------------+
      | (x: 0.12, y: 0.31, z: -0.08)       | (x: -0.05, y: 0.10, z: 0.22)
      v                                     v
  [ Hotspot Pin 1: Chuck ]              [ Hotspot Pin 2: Housing ]
      |                                     |
      +------------------+------------------+
                         | (User Click)
                         v
          [ Highlight Component Card in UI ]
8.2 Hotspot Position Calculation Engine (backend/app/services/hotspot_engine.py)
The backend parses object.glb bounds using trimesh or pygltflib to establish normalized bounding box [min_x, max_x, min_y, max_y, min_z, max_z].
Component spatial metadata (estimated_location: e.g. "top-front", "center", "handle") is mapped to relative normalized bounding box coordinates.
Coordinates are saved as Hotspot(position=Coordinates3D(x, y, z)).
8.3 Frontend Interactive Hotspot Rendering
Using @react-three/drei's <Html> wrapper inside React Three Fiber:

tsx

// Example R3F Hotspot Component
import { Html } from '@react-three/drei';
export function HotspotPin({ hotspot, isSelected, onClick }: { hotspot: Hotspot; isSelected: boolean; onClick: () => void }) {
  return (
    <group position={[hotspot.position.x, hotspot.position.y, hotspot.position.z]}>
      <mesh onClick={onClick}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial color={isSelected ? '#3b82f6' : '#ef4444'} emissive={isSelected ? '#1d4ed8' : '#991b1b'} />
      </mesh>
      <Html distanceFactor={10}>
        <button
          onClick={onClick}
          className={`px-2 py-1 text-xs font-bold rounded shadow-md border transition-all ${
            isSelected ? 'bg-blue-600 text-white border-blue-400 scale-110' : 'bg-slate-900/90 text-slate-200 border-slate-700 hover:bg-slate-800'
          }`}
        >
          {hotspot.label}
        </button>
      </Html>
    </group>
  );
}
9. EXPLODED VIEW IMPLEMENTATION SPECIFICATION
9.1 Technical Reality
A single monolithic mesh GLB cannot be physically pulled apart into discrete sub-components without CAD boundary representation.

9.2 Exploded View Modes
MVP Visual Exploded View (Annotated Hotspot Expansion): When the user toggles "Exploded View" mode in the 3D Viewer:
The single mesh remains stationary in the center.
The 3D Hotspot Pins dynamically translate outward along their normal vectors (nx * dist, ny * dist, nz * dist) using Framer Motion 3D / R3F spring animations.
Dashed 3D vector lines are drawn connecting the original surface position to the exploded hotspot pin label.
text

   NORMAL VIEW                      EXPLODED HOTSPOT VIEW
      [Mesh]                             [Mesh]
   (Pin on Mesh)             (Pin) <---- - - - (Dashed Line) ---- [Mesh Surface]
Future / Optional Sub-Mesh Exploded View: IF AND ONLY IF model.is_fallback == false AND the 3D generator returns a multi-node GLB (node_0, node_1), the viewer smoothly translates the child meshes outward along the bounding box centroid vectors.
10. FRONTEND DASHBOARD & SCREEN SPECIFICATIONS
The application is structured as a responsive single-page application (SPA) shell in Next.js.

text

+-----------------------------------------------------------------------------------+
| NAVBAR: Logo • Project Title • Status Indicator • Github/Docs Link                |
+-----------------------------------------------------------------------------------+
| NAVIGATION TABS: [01 Upload] -> [02 Analysis] -> [03 3D Explorer] -> [04 Report]   |
+-----------------------------------------------------------------------------------+
| MAIN WORKSPACE CONTAINER                                                          |
|                                                                                   |
|  +---------------------------------------+ +-----------------------------------+  |
|  | LEFT PANEL (3D Viewer / Controls)     | | RIGHT PANEL (Dynamic View Engine) |  |
|  |                                       | |                                   |  |
|  |  • R3F Canvas / Orbit Controls        | |  • Tab 1: Component Explorer      |  |
|  |  • Hotspot Pins / Exploded Toggle     | |  • Tab 2: Relationship Graph      |  |
|  |  • Model Reset / Wireframe Toggle     | |  • Tab 3: Material Analysis       |  |
|  |  • Fallback Model Disclaimer Banner   | |  • Tab 4: Reverse Eng. Report     |  |
|  +---------------------------------------+ +-----------------------------------+  |
+-----------------------------------------------------------------------------------+
10.1 Screen Descriptions & States
Screen 1: Landing & Upload Screen (/)
Purpose: Introduces product, captures 3–8 object photographs.
Components: Hero header, Drag-and-Drop file dropzone, thumbnail preview list, image remover, view tagger (Front, Back, etc.), "Start Reverse Engineering" button.
States: Empty, FilesSelected (3-8 files), InvalidFile (error toast).
Screen 2: Validation & Processing Screen (/analyze?job_id=...)
Purpose: Displays real-time progress of asynchronous job execution.
Components: Step-by-step progress bar (0 to 100%), live status message, animated technical blueprint graphic, error retry container.
States: PollingState, ErrorState.
Screen 3: Interactive 3D Inspection Dashboard (/result?job_id=...)
Purpose: Complete reverse-engineering workbench.
Components: R3F 3D Canvas, Hotspot pins, Exploded View toggle, Component Tree List (Detected/Inferred/Unknown badges), Selected Component Detail Card, React Flow Relationship Graph, Material Breakdown Table, Markdown Report Exporter.
11. 3D VIEWER SPECIFICATION (R3F + DREI)
11.1 Canvas Setup
Engine: @react-three/fiber <Canvas>
Camera: Perspective Camera, FOV 45, default position [0, 1.5, 3]
Controls: @react-three/drei <OrbitControls makeDefault enableDamping dampingFactor={0.05} minDistance={0.5} maxDistance={10} />
Lighting: Environment preset "city" + directional key light (intensity={1.5}, position={[5, 10, 5]}) + ambient light (intensity={0.5}).
11.2 GLB Model Renderer (frontend/src/components/3d/ModelViewer.tsx)
tsx

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, Stage, Html } from '@react-three/drei';
import { HotspotPin } from './HotspotPin';
import { AnalysisResult } from '@/types/analysis';
function ModelMesh({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}
export function ModelViewer({ result, selectedComponentId, onSelectComponent, isExploded }: {
  result: AnalysisResult;
  selectedComponentId: string | null;
  onSelectComponent: (id: string) => void;
  isExploded: boolean;
}) {
  return (
    <div className="relative w-full h-[600px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
      {result.model.is_fallback && (
        <div className="absolute top-3 left-3 z-10 px-3 py-1.5 bg-amber-500/20 border border-amber-500/50 rounded-lg text-amber-300 text-xs font-medium backdrop-blur-md">
          ⚠ Reference Geometry Displayed (Fallback Mode Active)
        </div>
      )}
      <Canvas camera={{ position: [0, 1.2, 2.5], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <Suspense fallback={<Html center><div className="text-white text-sm font-mono">Loading 3D Mesh...</div></Html>}>
          <Center top>
            <ModelMesh url={result.model.model_url} />
          </Center>
          {result.hotspots.map((hotspot) => (
            <HotspotPin
              key={hotspot.id}
              hotspot={hotspot}
              isExploded={isExploded}
              isSelected={selectedComponentId === hotspot.component_id}
              onClick={() => onSelectComponent(hotspot.component_id)}
            />
          ))}
        </Suspense>
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
}
12. BACKEND INFRASTRUCTURE & FILE MANAGEMENT
12.1 Directory Structure
The backend maintains strict disk storage separation under backend/storage/:

text

backend/
├── app/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── analyze.py
│   │   │   └── jobs.py
│   ├── core/
│   │   ├── config.py
│   │   └── security.py
│   ├── schemas/
│   │   └── analysis.py
│   ├── services/
│   │   ├── image_validator.py
│   │   ├── vision_ai.py
│   │   ├── reconstruction_3d.py
│   │   ├── hotspot_engine.py
│   │   └── report_generator.py
│   └── main.py
└── storage/
    ├── uploads/         # Subdirectories per job_id: uploads/{job_id}/image_0.jpg
    ├── models/          # Generated GLB assets: models/{job_id}/object.glb
    └── jobs/            # Job status & result JSON files: jobs/{job_id}.json
12.2 File Upload Validation Engine
Supported Extensions: .jpg, .jpeg, .png, .webp
Magic-Byte Header Rules: Verify JPEG (FF D8 FF), PNG (89 50 4E 47), WEBP (52 49 46 46). Reject renamed executables or script files immediately with 400 Bad Request.
Max Payload Limit: 15 MB per image. Maximum batch limit: 8 images (Total batch <= 100 MB).
12.3 Storage Cleanup Engine
Disk storage retention TTL: 24 hours.
A background cron worker (backend/app/services/cleanup.py) deletes job upload directories and .glb files older than 86,400 seconds.
13. IMAGE VALIDATION & COVERAGE ENGINE
Before triggering expensive AI calls, backend/app/services/image_validator.py evaluates uploaded files using OpenCV:

python

import cv2
import numpy as np
def analyze_image_quality(image_bytes: bytes) -> dict:
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        return {"valid": False, "reason": "Corrupt or unreadable image format"}
        
    # 1. Blur Detection (Laplacian Variance)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
    is_blur = laplacian_var < 80.0
    
    # 2. Exposure Check
    mean_brightness = np.mean(gray)
    is_underexposed = mean_brightness < 40.0
    is_overexposed = mean_brightness > 220.0
    
    # 3. Resolution Check
    h, w, _ = img.shape
    is_low_res = (w < 600 or h < 600)
    
    valid = not (is_blur or is_underexposed or is_overexposed or is_low_res)
    
    return {
        "valid": valid,
        "laplacian_var": round(laplacian_var, 2),
        "brightness": round(mean_brightness, 2),
        "dimensions": f"{w}x{h}",
        "warnings": [
            *(["Image is too blurry"] if is_blur else []),
            *(["Image is underexposed"] if is_underexposed else []),
            *(["Image is overexposed"] if is_overexposed else []),
            *(["Resolution below recommended 600x600"] if is_low_res else []),
        ]
    }
14. AI HALLUCINATION CONTROL & SYSTEM PROMPTS
To prevent Multimodal Vision LLMs from inventing fictitious internal engineering details, all LLM interactions MUST use Strict System Prompts enforcing JSON Schema outputs.

14.1 System Prompt Definition (backend/app/services/prompts.py)
text

You are an expert mechanical and optical visual reverse-engineering AI assistant.
Your task is to analyze the provided multi-view photographs of a physical object.
RULES FOR ANALYSIS:
1. ONLY identify components that have visible optical evidence OR undeniable physical functional necessity.
2. For EVERY component, assign one of three strict status values:
   - "detected": Surface boundaries are directly visible in at least one photo.
   - "inferred": Component is internal/enclosed but physically required for operation (e.g. internal motor inside a drill housing).
   - "unknown": Visual evidence is contradictory or missing.
3. DO NOT invent manufacturer model numbers, exact screw thread pitches, exact CAD dimensions, or exact metal alloy grades.
4. If visual evidence for internal geometry is absent, set status to "inferred" or "unknown" and state limitations explicitly in the "evidence" field.
5. Provide output strictly matching the requested JSON Schema. Do not wrap output in markdown fences or conversational text.
14.2 Schema Guardrail Middleware
If the LLM returns invalid JSON or fails Pydantic schema validation:

Backend catches ValidationError.
Automatically triggers 1 retry prompt appending the exact Pydantic validation error trace to the LLM context.
If retry fails, raises controlled 500 AI_ANALYSIS_FAILED job status without crashing the server.
15. DATA STORAGE & ASSET LIFECYCLE
text

UPLOAD EVENT → Create /storage/uploads/{job_id}/
             → Write validated raw image files
             → Create /storage/jobs/{job_id}.json (status="queued")
PROCESSING   → Read raw images for Vision AI & 3D Pipeline
             → Write generated /storage/models/{job_id}/object.glb
             → Update /storage/jobs/{job_id}.json with intermediate states
COMPLETION   → Finalize /storage/jobs/{job_id}.json with full AnalysisResult
             → Frontend fetches result via GET /api/jobs/{job_id}/result
             → Serve object.glb via static mount /static/models/{job_id}/object.glb
CLEANUP (24h)→ Background worker purges uploads/{job_id}/, models/{job_id}/, jobs/{job_id}.json
16. SECURITY, PRIVACY & API KEY SAFEGUARDS
API Keys: All keys (OPENAI_API_KEY, GEMINI_API_KEY, TRIPO_API_KEY) MUST be accessed exclusively in FastAPI backend via backend/app/core/config.py. NEVER expose keys in Next.js public env variables (NEXT_PUBLIC_...).
CORS Configuration: FastAPI CORS middleware MUST restrict origins strictly to configured frontend domains:
python

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://reversex-ai.vercel.app"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
Input Sanitization: Image file names are stripped of paths and special characters using pathlib.Path(filename).name before saving.
17. COMPREHENSIVE ERROR HANDLING & RESILIENCE MATRIX
Failure Mode	Trigger Condition	Backend Action	User-Visible Outcome	Fallback / Recovery
Invalid File Type	File header is .exe or corrupt	Reject in POST /api/analyze	Toast: "Invalid image format"	User selects valid image
Blurry Image Batch	All images Laplacian < 50	Return warning in validation step	Warning Modal: "Low photo clarity"	Option to proceed or re-upload
Vision AI Timeout	LLM API > 30s	Catch timeout exception	Progress update: "Retrying vision analysis"	Retry with fallback LLM model
3D Generation Fail	Tripo3D API error or 45s timeout	Log error, trigger Fallback Engine	Banner: "Reference geometry loaded"	Serve category is_fallback GLB
Malformed AI JSON	LLM outputs invalid JSON	Run 1 schema-guided retry	Status: "Validating AI schema"	Fallback to default response template
Job Not Found	Invalid job_id polled	Return 404 status	Redirect to upload screen	User starts new analysis
18. TEST OBJECT SET & E2E TESTING PROTOCOL
To mark the system complete, the platform MUST pass end-to-end test runs on at least 3 out of 5 standard benchmark objects:

Electric Drill (Enclosed power tool with chuck, trigger, housing, internal motor).
Desk Fan (Blades, cage guard, motor housing, base, control buttons).
Mechanical Keyboard (Keycaps, top plate, switches, PCB, bottom case).
Bicycle (Frame, wheels, handlebar, pedals, chain mechanism).
Toy Vehicle (Body shell, wheels, axles, windshield).
Test Criteria per Object:
 Upload 4-6 photographs.
 Validation engine approves image batch.
 Async job transitions seamlessly from queued to completed.
 Correct object identification (confidence >= 85%).
 Minimum 4 components identified with correct detected vs inferred badges.
 3D Model loads in R3F viewer without WebGL errors.
 At least 3 hotspot pins render correctly over the 3D model.
 Reverse engineering report generates valid Markdown summary.
19. MVP SCOPE & FEATURE PRIORITIZATION
text

+-----------------------------------------------------------------------------------+
| MUST HAVE (Core MVP - Mandatory for Hackathon Completion)                         |
| • Multi-image upload (3-8 images) & drag-and-drop UI                              |
| • OpenCV image quality validation (blur & brightness check)                       |
| • Asynchronous Job Queue API (POST /api/analyze, GET /api/jobs/{id})               |
| • Multimodal Vision AI integration with strict JSON Schema output                |
| • Detected / Inferred / Unknown component evidence engine                         |
| • 3D Reconstruction pipeline with Primary API + Fallback GLB asset store           |
| • Interactive R3F 3D Model Viewer with OrbitControls                              |
| • 3D Surface Hotspot Pin mapping & click selection                                |
| • Reverse Engineering Report generator & export                                   |
+-----------------------------------------------------------------------------------+
| SHOULD HAVE (Post-MVP Enhancements)                                               |
| • Animated Exploded View Hotspot Pin Expansion                                    |
| • React Flow Component Relationship Graph                                         |
| • Visual Material Estimation Breakdown matrix                                     |
+-----------------------------------------------------------------------------------+
| OPTIONAL / FUTURE (Not in Scope for Hackathon)                                    |
| • Engineering CAD STEP / IGES export                                              |
| • Sub-mesh geometry decomposition / physical mesh separation                      |
| • Exact dimensional measurement tools                                             |
| • User accounts & persistent database storage                                     |
+-----------------------------------------------------------------------------------+
20. SEQUENTIAL DEVELOPMENT PHASES
Implementation MUST proceed strictly through the following 28 sequential phases:

Phase 0 — Environment & Repository Setup
Objective: Initialize Next.js frontend, FastAPI backend, and workspace configs.
Tasks: Create frontend/ (Next.js 14, Tailwind, shadcn), backend/ (FastAPI, Pydantic), configure CORS, set up local run scripts.
Completion Test: Both servers run locally; GET /api/health returns 200 OK.
Phase 1 — API Schema Definition & Contracts
Objective: Establish common data structures.
Tasks: Write backend/app/schemas/analysis.py (Pydantic models) and frontend/src/types/analysis.ts (TypeScript interfaces).
Completion Test: Pydantic schema validation test passes; TypeScript compiles cleanly.
Phase 2 — Multi-Image Upload UI
Objective: Build frontend drag-and-drop upload workspace.
Tasks: Implement upload dropzone, thumbnail preview grid, image removal, view tagging (Front/Back/Side).
Completion Test: User can pick 3-8 images, preview them, and remove images cleanly.
Phase 3 — Backend Image Validation Engine
Objective: Validate uploaded images using OpenCV.
Tasks: Create image_validator.py checking magic bytes, resolution, blur (Laplacian variance), exposure.
Completion Test: Corrupt/blurry images rejected with descriptive error message.
Phase 4 — Asynchronous Job Lifecycle API
Objective: Implement job state management.
Tasks: Implement POST /api/analyze, GET /api/jobs/{job_id}, and GET /api/jobs/{job_id}/result with BackgroundTasks execution.
Completion Test: POST returns 202 Accepted + job_id; GET returns updated progress percentage.
Phase 5 — Frontend Polling & Progress State
Objective: Connect upload UI to job polling lifecycle.
Tasks: Build TanStack Query / custom hook polling /api/jobs/{job_id} every 2 seconds until completed or failed.
Completion Test: UI transitions smoothly from Upload -> Progress Bar -> Results view.
Phase 6 — Vision AI Object Identification
Objective: Extract main object name, category, and overview.
Tasks: Integrate Multimodal Vision AI prompt with base64 images; parse response into ObjectMetadata.
Completion Test: Valid test photos return accurate object name and category confidence.
Phase 7 — Vision AI Component Breakdown
Objective: Extract component list with evidence tiering.
Tasks: Implement prompt asking for visible (detected) vs enclosed (inferred) components; apply validation rules.
Completion Test: Response contains components with detected vs inferred status badges and evidence text.
Phase 8 — Component Relationship Engine
Objective: Deduce functional connections between components.
Tasks: AI prompt outputs Relationship tuples (source, target, relation_type, description).
Completion Test: Valid JSON graph returned linking motor -> gears -> chuck.
Phase 9 — 3D Reconstruction Engine (Primary & Fallback)
Objective: Generate textured .glb 3D model.
Tasks: Implement Primary Cloud 3D API call (Tripo3D/Meshy) with secondary local generator fallback and tertiary preprocessed CAD GLB asset loader (is_fallback=true).
Completion Test: Valid .glb file stored at backend/storage/models/{job_id}/object.glb.
Phase 10 — 3D Asset Processing & Bounding Geometry
Objective: Normalize GLB asset orientation and bounding dimensions.
Tasks: Load GLB with trimesh, center centroid at origin (0,0,0), scale bounding box diameter to 1.5 units, extract vertex count.
Completion Test: Model loads centered at origin with calculated bounding box metrics.
Phase 11 — Interactive 3D Viewer (R3F Canvas)
Objective: Render 3D model in browser.
Tasks: Build R3F <Canvas>, <OrbitControls>, <Stage>, lighting, and model loader.
Completion Test: .glb model renders in browser with smooth rotate, zoom, and pan controls.
Phase 12 — 3D Spatial Hotspot Mapping Engine
Objective: Calculate 3D surface coordinates for components.
Tasks: Map component estimated locations to normalized model surface points (x, y, z) in hotspot_engine.py.
Completion Test: Backend outputs array of Hotspot items associated with component IDs.
Phase 13 — Interactive Hotspot Pins & Raycasting
Objective: Overlay interactive pins on the 3D model.
Tasks: Build @react-three/drei <Html> hotspot pins that track camera rotation and respond to clicks.
Completion Test: Clicking 3D hotspot highlights corresponding component card in UI list.
Phase 14 — Component Explorer UI
Objective: Display searchable component breakdown list.
Tasks: Build sidebar component list with status filtering (All, Detected, Inferred, Unknown), search bar, and confidence meters.
Completion Test: Clicking component card focuses 3D camera/hotspot pin.
Phase 15 — Exploded View Hotspot Expansion Mode
Objective: Implement visual hotspot pin expansion.
Tasks: Toggle state translates hotspot pins outward along normal vectors with animated connecting vector lines.
Completion Test: Exploded view toggle expands pins outward smoothly without breaking canvas controls.
Phase 16 — Component Relationship Graph View
Objective: Visualize structural relationships.
Tasks: Build node-edge diagram using React Flow or Tailwind card flow displaying component connections.
Completion Test: Relationship graph renders correct links (e.g. "housing houses motor").
Phase 17 — Material Estimation Analysis Matrix
Objective: Present visual material estimations.
Tasks: Render material breakdown table showing category (Polymer, Metal), confidence, and visual indicators.
Completion Test: Table displays estimated materials with appropriate visual uncertainty warnings.
Phase 18 — Reverse Engineering Report Generator
Objective: Synthesize comprehensive analysis report.
Tasks: Backend generates Markdown report (Working Principle, Assembly Steps, Manufacturing Methods); frontend renders with copy/download.
Completion Test: User can export full formatted reverse-engineering report as Markdown / PDF.
Phase 19 — Limitations & Confidence Disclosure Panel
Objective: Clearly display system boundaries and uncertainty.
Tasks: Render dedicated panel summarizing visual limitations, missing viewpoints, and accuracy disclaimers.
Completion Test: Panel explicitly lists what was detected vs what could not be determined.
Phase 20 — Backend Static Asset Serving & Storage Cleanup
Objective: Mount model files and schedule cleanup.
Tasks: Mount /storage/models in FastAPI static files; create background worker purging files older than 24h.
Completion Test: .glb files accessible via HTTP GET; old files deleted automatically.
Phase 21 — Error Handling & UI Resilience Polish
Objective: Graceful handling of network & AI failures.
Tasks: Add error boundary UI, toast notifications, fallback banners, retry buttons across all screens.
Completion Test: Application recovers gracefully from simulated network drops or API timeouts.
Phase 22 — Test Object Benchmarking (Drill, Fan, Keyboard)
Objective: Validate end-to-end functionality on test objects.
Tasks: Execute complete pipeline on 3 benchmark photo sets.
Completion Test: 3 test objects complete analysis and display valid 3D views and reports.
Phase 23 — AI Hallucination Guardrail Verification
Objective: Verify no fake engineering claims occur.
Tasks: Audit LLM output traces to confirm no exact tolerances or model numbers were invented.
Completion Test: All inferred data flagged correctly; zero unsupported facts present.
Phase 24 — Performance Optimization & Bundle Tuning
Objective: Ensure fast load times and WebGL rendering at 60 FPS.
Tasks: Optimize R3F render loop, dynamic import for 3D canvas, lazy-load report markdown parser.
Completion Test: Lighthouse score > 85; 3D viewer runs smoothly without dropped frames.
Phase 25 — Security & API Secret Audit
Objective: Verify no credential leakage.
Tasks: Inspect client JS bundle for exposed API keys; check CORS rules.
Completion Test: Zero API secrets found in client build artifacts.
Phase 26 — End-to-End User Flow Polish
Objective: Refine UI styling and navigation smoothness.
Tasks: Add polished dark-mode styling, loading skeletons, Framer Motion transitions, responsive mobile layouts.
Completion Test: Application looks visually clean, modern, and professional.
Phase 27 — Final Acceptance & Demo Readiness
Objective: Final verification against project rules.
Tasks: Perform dry run of complete hackathon demonstration script.
Completion Test: All Definition of Done criteria satisfied; ready for presentation.
21. AI CODING AGENT OPERATING RULES
Any AI coding agent modifying this codebase MUST comply with the following 15 rules:

Read Before Editing: Read this entire specification before proposing or generating code.
Never Invent Architecture: Do not add unapproved databases, authentication frameworks, or message brokers (e.g., Redis, PostgreSQL, Prisma) unless this document is updated first.
Strict Schema Compliance: Do not alter API JSON keys or types. Match Pydantic and TypeScript models exactly.
No Synchronous API Hacks: Never revert POST /api/analyze to a single long synchronous blocking call.
No Mocking in Production Code: Do not replace real backend AI/3D execution with static mock delay timers (time.sleep()) i... (5 KB left)
