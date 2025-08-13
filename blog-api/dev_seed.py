import asyncio
from sqlalchemy import select

from app.database.session import engine, AsyncSessionLocal, Base
from app.database.models import User, Blog

async def seed_users(session):
    print("Seeding Users 👤")
    # create sample user(s)
    user1 = User(email="john@example.com", hashed_password="hdfhSFD^&f2834sad39")
    user2 = User(email="bob@example.com", hashed_password="hdfhSFD^&f28346")

    session.add_all([user1, user2])
    await session.commit()
    print("Users seeded successfully ✅")
        
async def seed_blogs(session):
    print("Seeding Blogs 📝")
    # fetch users list
    result = await session.execute(select(User))
    users_result = result.scalars().all()
    
    user1 = users_result[0].id
    user2 = users_result[1].id
    
    # Create sample blogs
    blog1 = Blog(title="Hello World", content="My first blog post", author=user1)
    blog2 = Blog(title="Another Post", content="By Bob", author=user2)
    blog3 = Blog(title="Third Post", content="Lorem Ipsum Dolor ...", author=user1)
    session.add_all([blog1, blog2, blog3])
    await session.commit()
    print("Blogs Seeded Successfully ✅.")
    
async def seed_tags(session):
    pass

async def main():
    async with engine.begin() as conn:
        # (Optionally), Drop the tables
        # await conn.run_sync(Base.metadata.drop_all)
        # create tables if they don't exist
        await conn.run_sync(Base.metadata.create_all)
        
    # asyncio.run(seed_data())
    async with AsyncSessionLocal() as session:
        await seed_users(session)
        await seed_tags(session)
        await seed_blogs(session)
    
if __name__ == '__main__':
    asyncio.run(main())