import os
import subprocess
import asyncio
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import OperationalError

from app.database.session import AsyncSessionLocal #, Base, engine
from app.database.models import User, Blog

ENV = os.getenv("ENV", "development")

async def is_table_empty(session: AsyncSession, model) -> bool:
    stmt = select(func.count()).select_from(model)
    result = await session.execute(stmt)
    count = result.scalar_one()
    return count == 0

async def seed_users(session):
    if await is_table_empty(session, User):
        print("Seeding Users 👤")

        user1 = User(email="john@example.com", hashed_password="hdfhSFD^&f2834sad39")
        user2 = User(email="bob@example.com", hashed_password="hdfhSFD^&f28346")

        session.add_all([user1, user2])
        await session.commit()
        print("Users seeded successfully ✅")
    else:
        print("⚠️ users already exist. Skipping.")
        
async def seed_blogs(session):
    if await is_table_empty(session, Blog):
        print("Seeding Blogs 📝")
    
        result = await session.execute(select(User))
        users_result = result.scalars().all()
        
        user1 = users_result[0]
        user2 = users_result[1]
        
        # Create sample blogs
        blog1 = Blog(title="Hello World", content="My first blog post", author=user1)
        blog2 = Blog(title="Another Post", content="By Bob", author=user2)
        blog3 = Blog(title="Third Post", content="Lorem Ipsum Dolor ...", author=user1)
        session.add_all([blog1, blog2, blog3])
        await session.commit()
        print("Blogs Seeded Successfully ✅.")
    else:
        print("⚠️ blogs already exist. Skipping.")
    
async def seed_tags(session):
    pass

async def main():
    if ENV != "development":
        print("⚠️  Skipping seed — not in development environment.")
        return
    
    # !! DON'T USE drop_all AND/OR create_all WHEN USING alembic !!
    #
    # async with engine.begin() as conn:
    #     # (Optionally), Drop the tables
    #     await conn.run_sync(Base.metadata.drop_all)
    #     # create tables if they don't exist
    #     await conn.run_sync(Base.metadata.create_all)
    
    try:
        async with AsyncSessionLocal() as session:
            await seed_users(session)
            await seed_tags(session)
            await seed_blogs(session)
            
    except OperationalError as e:
        if "no such table" in str(e):
            print("⚠️  DB is empty! Running Alembic migrations ...⚙️")
            subprocess.run(["alembic", "upgrade", "head"])
            
            # ✅ Re-create the session AFTER migration!
            async with AsyncSessionLocal() as session:
                await seed_users(session)
                await seed_tags(session)
                await seed_blogs(session)
        else:
            raise
    
if __name__ == '__main__':
    asyncio.run(main())
    