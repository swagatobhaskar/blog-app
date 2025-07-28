from typing import Annotated
from fastapi import FastAPI, Depends, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.config import Settings, get_settings

app = FastAPI()

# Use settings as Dependency Injection
@app.get("/")
def root_info(settings: Annotated[Settings, Depends(get_settings)]):
    
    return JSONResponse(
        status_code=status.HTTP_200_OK, 
        content= {
            "message": "Hello, World!",
            "App name": settings.app_name,
            "env": settings.env,
            "debug": settings.debug
        }
    )