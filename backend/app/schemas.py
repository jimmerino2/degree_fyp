from typing import Literal

from pydantic import BaseModel

# Mirrors `Cause` in src/types/domain.ts.
Cause = Literal["healthy", "disease", "pest", "nutrient", "water", "supply", "unsure"]
PartType = Literal["leaf", "stem", "fruit", "whole"]


class Health(BaseModel):
    status: Literal["ok"]
    model_loaded: bool


class PartPrediction(BaseModel):
    part: PartType
    cause: Cause
    label: str  # Fine-grained class, e.g. "leaf_curl".
    confidence: float


class DiagnoseResponse(BaseModel):
    cause: Cause
    confidence: float
    parts: list[PartPrediction]
    mock: bool  # True until a trained model is loaded.
