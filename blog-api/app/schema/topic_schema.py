from pydantic import BaseModel, Field
import uuid

class TopicBase(BaseModel):
    name: str = Field(..., max_length=50)
    description: str | None = None
    
class TopicCreate(TopicBase):
    pass

class TopicOut(TopicBase):
    id: uuid.UUID
    
    class Config:
        from_attributes = True
        
class TopicUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
