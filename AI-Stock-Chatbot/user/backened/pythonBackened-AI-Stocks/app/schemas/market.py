from pydantic import BaseModel
from typing import Any

class QuoteResponse(BaseModel):
    success: bool
    data: Any