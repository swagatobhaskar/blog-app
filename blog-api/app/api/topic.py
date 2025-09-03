from fastapi import APIRouter, status, HTTPException, Depends, Query
from fastapi.responses import JSONResponse
from typing import List
from sqlalchemy import select, Uuid
# from sqlalchemy.orm import selectinload, joinedload
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

@router.get('/{topic_id}', response_model=topic_schema.TopicOut, status_code=status.HTTP_200_OK)
async def get_topic_by_id(topic_id: uuid.UUID, session: AsyncSession = Depends(get_db)):
    stmt = select(Topic).where(Topic.id == topic_id)
    result = await session.execute(stmt)
    topic = result.scalar_one_or_none()
    
    if not topic:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Topic not found")
    return topic


@router.post('/', response_model=topic_schema.TopicOut, status_code=status.HTTP_201_CREATED)
async def create_new_topic(new_topic_data: topic_schema.TopicCreate, session: AsyncSession = Depends(get_db)):
    new_topic = Topic(
        name = new_topic_data.name,
        description = new_topic_data.description
    )
    session.add(new_topic)
    try:
        await session.commit()
        await session.refresh(new_topic)  # Refresh to get the generated ID and other defaults
        return new_topic
    except IntegrityError:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Integrity error: Possibly duplicate topic name."
        )
    except SQLAlchemyError as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error occurred."
        )

@router.patch('/{topic_id}', response_model=topic_schema.TopicOut, status_code=status.HTTP_200_OK)
async def update_topic(topic_id: uuid.UUID, updated_data: topic_schema.TopicUpdate, session: AsyncSession = Depends(get_db)):
    stmt = select(Topic).where(Topic.id == topic_id)
    result = await session.execute(stmt)
    topic = result.scalar_one_or_none()
    
    if not topic:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Topic not found")
    
    if updated_data.name is not None:
        topic.name = updated_data.name
    if updated_data.description is not None:
        topic.description = updated_data.description
    
    try:
        await session.commit()
        await session.refresh(topic)  # Refresh to get the latest data
        return topic
    except IntegrityError:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Integrity error: Possibly duplicate topic name."
        )
    except SQLAlchemyError:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error occurred."
        )
        
@router.delete('/{topic_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_topic(topic_id: uuid.UUID, session: AsyncSession = Depends(get_db)):
    stmt = select(Topic).where(Topic.id == topic_id)
    result = await session.execute(stmt)
    topic = result.scalar_one_or_none()
    
    if not topic:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Topic not found")
    
    await session.delete(topic)
    try:
        await session.commit()
        return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content={})
    except SQLAlchemyError:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error occurred."
        )

@router.get('/search/', response_model=List[topic_schema.TopicOut], status_code=status.HTTP_200_OK)
async def search_topics(query: str = Query(..., min_length=1), session: AsyncSession = Depends(get_db)):
    try:
        stmt = select(Topic).where(Topic.name.ilike(f'%{query}%')).order_by(Topic.name.asc())  # or Topic.id.desc()
        result = await session.execute(stmt)
        topics = result.scalars().all()
        return topics
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error occurred."
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred."
        )
        