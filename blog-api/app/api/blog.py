from fastapi import APIRouter, status, HTTPException, Depends
from fastapi.responses import JSONResponse
from typing import List
from sqlalchemy import select, Uuid
from sqlalchemy.orm import selectinload, joinedload
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
import uuid

from app.dependencies import get_db
from app.database.session import AsyncSession
from app.database.models import User, Blog
from app.schema import blog_schema

router = APIRouter(prefix='/api/blog', tags=['blogs'])

@router.get('/', response_model=List[blog_schema.BlogOut], status_code=status.HTTP_200_OK)
async def get_all_blogs(session: AsyncSession = Depends(get_db)):
    results = await session.execute(
        select(Blog).options(joinedload(Blog.author))   # Use joinedload if you always want author with Blog
    )
    return results.scalars().all()


@router.get('/{blog_id}', response_model=blog_schema.BlogOut, status_code=status.HTTP_200_OK)
async def get_blog_by_id(blog_id: uuid.UUID, session: AsyncSession = Depends(get_db)):
    # UserOut isn't coming
    stmt = select(Blog).where(Blog.id == blog_id).options(selectinload(Blog.author))
    result = await session.execute(stmt)
    blog = result.scalar_one_or_none()
    
    if not blog:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blog not found")
    return blog


@router.post('/', response_model=blog_schema.BlogOut, status_code=status.HTTP_201_CREATED)
async def create_new_blog(new_blog_data: blog_schema.BlogCreate, session: AsyncSession = Depends(get_db)):
    temp_user_result = await session.execute(
        select(User).limit(1)
    )
    temp_user = temp_user_result.scalars().first()
    
    new_blog = Blog(
        title = new_blog_data.title,
        content = new_blog_data.content,
        author = temp_user
    )
    session.add(new_blog)
    await session.commit()
    
    # Query the saved blog with author eagerly loaded
    result = await session.execute(
        select(Blog)
        .options(selectinload(Blog.author))
        .where(Blog.id == new_blog.id)
    )
    
    new_saved_blog = result.scalars().first()
    return new_saved_blog


@router.patch('/{blog_id}', response_model=blog_schema.BlogOut, status_code=status.HTTP_200_OK)
async def update_blog(blog_id: uuid.UUID, updated_blog_data: blog_schema.BlogUpdate, session: AsyncSession = Depends(get_db)):

    requested_blog_result = await session.execute(
        select(Blog).where(Blog.id == blog_id)
    )
    
    requested_blog = requested_blog_result.scalar_one_or_none()
    print("requested_blog::", requested_blog)
    if not requested_blog:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blog with this id not found!")
    
    try:
        if updated_blog_data.title:
            requested_blog.title = updated_blog_data.title
        if updated_blog_data.content:
            requested_blog.content = updated_blog_data.content
        if updated_blog_data.is_draft:
            requested_blog.is_draft = updated_blog_data.is_draft
        
        await session.commit()
        
        result = await session.execute(
            select(Blog)
            .options(selectinload(Blog.author))
            .where(Blog.id == requested_blog.id)
        )
    
        patched_blog = result.scalars().first()
        return patched_blog
        
    except SQLAlchemyError as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Note creation failed. Please try again."
        )

@router.delete('/{blog_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_blog(blog_id: uuid.UUID, session: AsyncSession = Depends(get_db)):
    requested_blog_result = await session.execute(
        select(Blog).where(Blog.id == blog_id)
    )
    
    requested_blog = requested_blog_result.scalar_one_or_none()
    print("requested_blog::", requested_blog)
    if not requested_blog:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blog with this id not found!")
    
    try:
        await session.delete(requested_blog)
        await session.commit()        
    except SQLAlchemyError as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Blog deletion failed. Please try again."
        )
        