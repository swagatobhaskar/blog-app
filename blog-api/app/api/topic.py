from fastapi import APIRouter, status, HTTPException, Depends
from fastapi.responses import JSONResponse
from typing import List
from sqlalchemy import select, Uuid
from sqlalchemy.orm import selectinload, joinedload
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
import uuid

from app.dependencies import get_db
from app.database.session import AsyncSession
from app.database.models import Topic
from app.schema import topic_schema

router = APIRouter(prefix='/api/topic', tags=['topics'])

@router.get('/', response_model=List[topic_schema.TopicOut], status_code=status.HTTP_200_OK)
async def get_all_topics(session: AsyncSession = Depends(get_db)):
    results = await session.execute(
        select(Topic)
    )
    return results.scalars().all()
