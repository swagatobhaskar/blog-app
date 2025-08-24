from typing import Annotated
from fastapi import FastAPI, Depends, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import Settings, get_settings
from app.database.session import engine, Base
from app.api import blog, user, auth, topic


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

allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(blog.router)
app.include_router(user.router)
app.include_router(auth.router)
app.include_router(topic.router)

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