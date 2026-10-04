"""Tests for Common System Representation Pydantic schemas."""

import pytest
from pydantic import ValidationError

from backend.app.schemas.system import (
    SystemComponent,
    SystemMetadata,
    SystemRelationship,
    SystemRepresentation,
    SystemType,
    SystemUncertainty,
)


def test_system_representation_valid_instantiation():
    """Test creating a valid SystemRepresentation matching AGENTS.md requirements."""
    data = {
        "system": {
            "id": "sys_001",
            "name": "Drone Model",
            "type": "physical",
            "description": "Exploded drone hardware assembly",
        },
        "components": [
            {
                "id": "comp_motor1",
                "name": "Brushless Motor 01",
                "type": "mechanical_part",
                "confidence": 0.95,
            }
        ],
        "relationships": [
            {
                "source": "sys_001",
                "target": "comp_motor1",
                "type": "contains",
                "confidence": 0.99,
            }
        ],
        "behaviors": [],
        "evidence": [],
        "uncertainties": [
            {
                "id": "unc_01",
                "description": "Internal motor wiring coil gauge is unverified",
                "target_id": "comp_motor1",
                "score": 0.4,
            }
        ],
    }

    rep = SystemRepresentation(**data)
    assert rep.system.id == "sys_001"
    assert rep.system.type == SystemType.PHYSICAL
    assert len(rep.components) == 1
    assert rep.components[0].id == "comp_motor1"
    assert rep.components[0].confidence == 0.95
    assert len(rep.relationships) == 1
    assert len(rep.uncertainties) == 1


def test_confidence_validation_out_of_bounds():
    """Verify confidence value validation rejects numbers outside [0.0, 1.0]."""
    with pytest.raises(ValidationError):
        SystemComponent(
            id="c1", name="Test", type="ui", confidence=1.5  # > 1.0 invalid
        )

    with pytest.raises(ValidationError):
        SystemRelationship(
            source="c1", target="c2", type="connects", confidence=-0.1  # < 0.0 invalid
        )
