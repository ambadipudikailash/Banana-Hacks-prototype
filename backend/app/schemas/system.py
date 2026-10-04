"""Pydantic schemas for Common System Representation."""

from enum import Enum
from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class SystemType(str, Enum):
    """Supported system representation types."""

    WEBSITE = "website"
    PHYSICAL = "physical"
    APP = "app"
    DIAGRAM = "diagram"
    UNKNOWN = "unknown"


class SystemMetadata(BaseModel):
    """Metadata describing the overall target system."""

    id: str = Field(..., description="Unique identifier for the system")
    name: str = Field(..., description="Human-readable name of the system")
    type: SystemType = Field(
        default=SystemType.UNKNOWN,
        description="Domain classification of the system",
    )
    description: Optional[str] = Field(
        None, description="Optional brief explanation of the system"
    )


class SystemComponent(BaseModel):
    """Individual extracted component of a system."""

    id: str = Field(..., description="Unique identifier for the component")
    name: str = Field(..., description="Name of the component")
    type: str = Field(
        ..., description="Component type e.g. ui_element, mechanical_part, module"
    )
    parent_id: Optional[str] = Field(
        None, description="Parent component ID for hierarchical nesting"
    )
    confidence: Optional[float] = Field(
        None, ge=0.0, le=1.0, description="Detection confidence metric between 0 and 1"
    )
    metadata: Optional[Dict[str, str]] = Field(
        default_factory=dict, description="Arbitrary metadata key-value pairs"
    )


class SystemRelationship(BaseModel):
    """Relationship or dependency between two components."""

    source: str = Field(..., description="Source component ID")
    target: str = Field(..., description="Target component ID")
    type: str = Field(
        ..., description="Relationship type e.g. contains, connects_to, calls"
    )
    description: Optional[str] = Field(
        None, description="Optional description of the interaction"
    )
    confidence: Optional[float] = Field(
        None, ge=0.0, le=1.0, description="Relationship confidence score between 0 and 1"
    )


class SystemBehavior(BaseModel):
    """Functional behavior or operation observed/inferred in the system."""

    id: str = Field(..., description="Unique identifier for the behavior")
    description: str = Field(..., description="Description of the behavior")
    trigger: Optional[str] = Field(
        None, description="Event or condition that triggers the behavior"
    )
    action: Optional[str] = Field(
        None, description="Action or output resulting from the behavior"
    )


class SystemEvidence(BaseModel):
    """Visual or textual evidence supporting reverse engineering conclusions."""

    id: str = Field(..., description="Unique evidence ID")
    description: str = Field(..., description="Description of the evidence")
    source_location: Optional[str] = Field(
        None, description="Bounding box or region reference in input visual"
    )


class SystemUncertainty(BaseModel):
    """Explicit tracking of missing information or uncertain deductions."""

    id: str = Field(..., description="Unique uncertainty ID")
    description: str = Field(..., description="Explanation of what is uncertain")
    target_id: Optional[str] = Field(
        None, description="ID of affected component or relationship if applicable"
    )
    score: Optional[float] = Field(
        None, ge=0.0, le=1.0, description="Uncertainty level from 0 (low) to 1 (high)"
    )


class SystemRepresentation(BaseModel):
    """Common Intermediate System Representation."""

    system: SystemMetadata
    components: List[SystemComponent] = Field(default_factory=list)
    relationships: List[SystemRelationship] = Field(default_factory=list)
    behaviors: List[SystemBehavior] = Field(default_factory=list)
    evidence: List[SystemEvidence] = Field(default_factory=list)
    uncertainties: List[SystemUncertainty] = Field(default_factory=list)
