from pydantic import BaseModel
import uuid
from datetime import datetime

from app.database.models import User

class BlogBase(BaseModel):
    title: str
    content: str

class BlogOut(BlogBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    is_draft: bool
    # author: User or user_schema.UserOut
    
    class config:
        from_attributes = True