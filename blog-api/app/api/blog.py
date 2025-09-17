from fastapi import APIRouter, status, HTTPException, Depends
from fastapi.responses import JSONResponse
from typing import List
from sqlalchemy import select, Uuid
from sqlalchemy.orm import selectinload, joinedload
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
import uuid
import logging

from app.utils.rte_sanitize import sanitize
from app.dependencies import get_current_user, get_db
from app.database.session import AsyncSession
from app.database.models import User, Blog, Topic
from app.schema import blog_schema

router = APIRouter(prefix='/api/blog', tags=['blogs'])

@router.get('/', response_model=List[blog_schema.BlogOut], status_code=status.HTTP_200_OK)
async def get_all_blogs(session: AsyncSession = Depends(get_db)):
    try:
        results = await session.execute(
            select(Blog)
            # If is_draft can be NULL in the DB and NULL can be treated like False.
            .where((Blog.is_draft == False) | (Blog.is_draft.is_(None)))
            .options(joinedload(Blog.author))   # Use joinedload if you always want author with Blog
        )
        return results.scalars().all()
    except SQLAlchemyError as e:
        # Handle any DB-related error
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error occurred"
        )

    except Exception as e:
        # Handle any other unexpected error
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )

@router.get('/draft', response_model=List[blog_schema.BlogOut], status_code=status.HTTP_200_OK)
async def get_all_draft_blogs(session: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        results = await session.execute(
            select(Blog)
            .where(
                Blog.is_draft.is_(True),
                Blog.author_id == current_user.id
            )
            .options(joinedload(Blog.author))   # Use joinedload if you always want author with Blog
        )
        return results.scalars().all()
    
    except SQLAlchemyError as e:
        # Handle any DB-related error
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error occurred"
        )

    except Exception as e:
        # Handle any other unexpected error
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )

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
async def create_new_blog(
    new_blog_data: blog_schema.BlogCreate,
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):
 
    selected_topics = []
    
    if new_blog_data.topic_ids:
        result = await session.execute(
            select(Topic).where(Topic.id.in_(new_blog_data.topic_ids))
        )
        selected_topics = result.scalars().all()
        
        if len(selected_topics) != len(set(new_blog_data.topic_ids)):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Some topics not found"
            )
    
        # print("Selected topics:", selected_topics)
        # logger = logging.getLogger(__name__)
        # logger.info(f"Selected topics: {selected_topics}")
    
    sanitized_blog_content: str = sanitize(new_blog_data.content)
    
    new_blog = Blog(
        title = new_blog_data.title,
        content = sanitized_blog_content, # new_blog_data.content,
        is_draft = new_blog_data.is_draft,
        author_id = current_user.id,
        topics = selected_topics
    )
    session.add(new_blog)
    
    try:
        # Commit the transaction (this flushes and persists the blog)
        await session.commit()
        await session.refresh(new_blog, attribute_names=["author", "topics"])  # Refresh to get the generated ID and other defaults
        return new_blog
    
    except IntegrityError:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Integrity error: Possibly duplicate blog title."
        )
        
    except SQLAlchemyError as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error {str(e)}"
        )
        
        
@router.patch('/{blog_id}', response_model=blog_schema.BlogOut, status_code=status.HTTP_200_OK)
async def update_blog(
    blog_id: uuid.UUID,
    updated_blog_data: blog_schema.BlogUpdate,
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):

    requested_blog_result = await session.execute(
        select(Blog)
        .options(selectinload(Blog.author))  # Eager load the author
        .where(Blog.id == blog_id, Blog.author_id == current_user.id)
    )
    
    requested_blog = requested_blog_result.scalar_one_or_none() # result.scalars().first() ?
    
    if not requested_blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found or method not allowed!"
        )
    
    # Update the blog attributes if provided
    if updated_blog_data.title:
        requested_blog.title = updated_blog_data.title
    if updated_blog_data.content:
        sanitized_blog_content: str = sanitize(updated_blog_data.content)
        requested_blog.content = sanitized_blog_content
    if updated_blog_data.is_draft is not None: # Use is not None to allow both True and False to go through
        requested_blog.is_draft = updated_blog_data.is_draft
        
    if updated_blog_data.topic_ids is not None:

        topic_result = await session.execute(
            select(Topic).where(Topic.id.in_(updated_blog_data.topic_ids))
        )
        updated_topics = topic_result.scalars().all()
        print("Updated topics:", updated_topics)
        if len(updated_topics) != len(set(updated_blog_data.topic_ids)):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Some topics not found")
        
        requested_blog.topics = list(updated_topics)   # Replace existing associations
        
    # To make the update more dynamic and DRY (don’t repeat yourself), you could loop over the fields to update:
    # update_data = updated_blog_data.model_dump(exclude_unset=True)
    # for field, value in update_data.items():
    #     setattr(requested_blog, field, value)
    
    try:
        await session.commit()
    
        # The object is already updated, and we have eager-loaded the author, so return the updated blog
        # return requested_blog (already eagerly loaded with the author)
        await session.refresh(requested_blog)  # Refresh to get the latest data
        return requested_blog

        # NOT NEEDED since we eager loaded with author previously
        # result = await session.execute(
        #     select(Blog)
        #     .options(selectinload(Blog.author))
        #     .where(Blog.id == requested_blog.id)
        # )
        # patched_blog = result.scalars().first()
        # return patched_blog
    
    except SQLAlchemyError as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Note creation failed. Please try again."
        )

@router.delete('/{blog_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_blog(
    blog_id: uuid.UUID,
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):
    requested_blog_result = await session.execute(
        select(Blog)
        .where(
            Blog.id == blog_id,
            Blog.author_id == current_user.id
        )
    )
    
    requested_blog = requested_blog_result.scalar_one_or_none()
    # print("requested_blog::", requested_blog)
    if not requested_blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found or you are not authorized to delete it!"
        )
    
    try:
        await session.delete(requested_blog)
        await session.commit()        
    except SQLAlchemyError as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Blog deletion failed. Please try again."
        )
                
@router.get('/draft/{blog_id}', response_model=blog_schema.BlogOut, status_code=status.HTTP_200_OK)
async def get_draft_blog_by_id(
    blog_id: uuid.UUID,
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):
    try:
        stmt = (
            select(Blog)
            # To be extra explicit over `Blog.is_draft == True`
            .where(
                Blog.id == blog_id,
                Blog.is_draft.is_(True),
                Blog.author_id == current_user.id    
            )
            .options(selectinload(Blog.author))
        )
        result = await session.execute(stmt)
        draft_blog = result.scalar_one_or_none()
        
        if not draft_blog:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Draft blog not found")
        return draft_blog
    
    except SQLAlchemyError as e:
        # Handle any DB-related error
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error occurred"
        )

    except Exception as e:
        # Handle any other unexpected error
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )
