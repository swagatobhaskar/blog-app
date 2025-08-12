import asyncio
from sqlalchemy import select

from app.database.session import engine, AsyncSessionLocal, Base
from app.database.models import User, Blog

async def seed_users(session):
    # create sample user(s)
    user1 = User(email="john@example.com", hashed_password="hdfhSFD^&f2834sad39")
    user2 = User(email="bob@example.com", hashed_password="hdfhSFD^&f28346")

    session.add_all([user1, user2])
    await session.commit()
        
async def seed_blogs(session):
    # fetch user
    user1 = await session.execute(select(User).filter(User.id == 'cd1893ce-bd8e-4efe-ae1a-6f8df1203458')) # or select random from a results loop
    
    # Create sample blogs
    blog1 = Blog(title="Hello World", content="My first blog post", author=user1)
    # blog2 = Blog(title="Another Post", content="By Bob", author=user2)
    
    session.add_all([blog1, blog2])
    await session.commit()

async def seed_tags(session):
    pass

async def main():
    async with engine.begin() as conn:
        # create tables if they don't exist
        await conn.run_sync(Base.metadata.create_all)
        
    # asyncio.run(seed_data())
    async with AsyncSessionLocal() as session:
        await seed_users(session)
        await seed_tags(session)
        await seed_blogs(session)
    
if __name__ == '__main__':
    asyncio.run(main())