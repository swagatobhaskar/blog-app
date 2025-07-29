from typing import Annotated
from fastapi import FastAPI, Depends, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import Settings, get_settings
from app.database.session import engine, Base

@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup logic: create DB tables
    print("START-UP")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    yield   # The app runs during this time
    # Shutdown: do any cleanup here if needed
    await engine.dispose()  # clean up

      
app = FastAPI(lifespan=lifespan)

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