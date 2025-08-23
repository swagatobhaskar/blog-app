import os
import uuid
from datetime import datetime
from typing import List
from sqlalchemy import String, ForeignKey, Text, func, DateTime, Boolean, Uuid, Table, Column
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
    

blog_topic_association = Table(
    'blog_topic_association',
    Base.metadata,
    Column('blog_id', Uuid(as_uuid=True), ForeignKey('blogs.id'), primary_key=True),
    Column('topic_id', Uuid(as_uuid=True), ForeignKey('topics.id'), primary_key=True)
)

# server_default=func.now()
# That's great for DB-level timestamps. Just make sure your DB supports timezone-aware timestamps (SQLite doesn't).

class Blog(Base):
    __tablename__ = "blogs"
    
    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    content: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    is_draft: Mapped[bool] = mapped_column(Boolean, default=True, server_default="false", nullable=False)
    # many-to-one relation with User
    author_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    author: Mapped["User"] = relationship(back_populates="blogs")
    # many-to-many relation with Topic
    topics: Mapped[List["Topic"]] = relationship(secondary=blog_topic_association, back_populates="blogs", lazy="selectin")
    
    def __repr__(self) -> str:
        return f"<Blog(id={self.id}, title={self.title[:20]})>"

class Topic(Base):
    __tablename__ = "topics"
    
    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    description: Mapped[str] = mapped_column(Text) # nullable=True
    # Many-to-many relation with Blog
    blogs: Mapped[List["Blog"]] = relationship(secondary=blog_topic_association, back_populates="topics", lazy="selectin")
    
    def __repr__(self) -> str:
        return f"<Topic(id={self.id}, name={self.name})>"
    