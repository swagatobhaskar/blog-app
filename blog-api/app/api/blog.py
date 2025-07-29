from fastapi import APIRouter, status, HTTPException, Depends
from fastapi.responses import JSONResponse
from typing import List
from sqlalchemy import select

from app.dependencies import get_db
from app.database.session import AsyncSession
from app.database.models import User, Blog
from app.schema import blog_schema

router = APIRouter(prefix='/api/blog', tags=['blogs'])

@router.get('/', response_model=List[blog_schema.BlogOut], status_code=status.HTTP_200_OK)
async def get_all_blogs(db: AsyncSession = Depends(get_db)):
    all_blogs = await db.execute(select(Blog))
    return all_blogs.scalars().all()

