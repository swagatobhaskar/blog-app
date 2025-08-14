from fastapi import APIRouter, status, HTTPException, Depends
from fastapi.responses import JSONResponse
from typing import List
from sqlalchemy import select, Uuid
from sqlalchemy.orm import selectinload, joinedload
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
