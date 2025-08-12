import os
import uuid
from datetime import datetime
from typing import List
from sqlalchemy import String, ForeignKey, Text, func, DateTime, Boolean, Uuid
from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy.dialects.postgresql import UUID as PG_UUID

from .session import Base

class User(Base):
    __tablename__ = "users"
    
    # using sqlalchemy 2.0 Uuid, for database agnostic uuid type.
    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String)
    hashed_password: Mapped[str] = mapped_column(Text)
    # one-to-many relation with Blog
    blogs: Mapped[List["Blog"]] = relationship(back_populates='author', cascade="all, delete")
    
    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email})>"
    

class Blog(Base):
    __tablename__ = "blogs"
    
    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    title: Mapped[str] = mapped_column(String, nullable=False)
    content: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    is_draft: Mapped[bool] = mapped_column(Boolean, default=True, server_default="false", nullable=False)
    # many-to-one relation with User
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    author: Mapped["User"] = relationship(back_populates="blogs")
    
    def __repr__(self) -> str:
        return f"<Blog(id={self.id}, title={self.title[:20]})>"
    