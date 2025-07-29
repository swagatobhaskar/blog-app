from fastapi import APIRouter, status, HTTPException
from fastapi.responses import JSONResponse
from typing import List

from app.schema import blog_schema

router = APIRouter(prefix='/api/blog', tags=['blogs'])

@router.get('/', response_model=List[blog_schema.BlogOut], status_code=status.HTTP_200_OK)
def get_all_blogs():
    pass