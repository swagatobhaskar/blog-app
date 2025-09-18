import os
import subprocess
import asyncio
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import OperationalError

from app.database.session import AsyncSessionLocal
from app.database.models import User, Blog, Topic
from app.utils.security import hash_password

ENV = os.getenv("ENV", "development")

async def is_table_empty(session: AsyncSession, model) -> bool:
    stmt = select(func.count()).select_from(model)
    result = await session.execute(stmt)
    count = result.scalar_one()
    return count == 0

async def seed_users(session):
    if await is_table_empty(session, User):
        print("Seeding Users 👤")

        user1 = User(email="john@example.com", hashed_password=hash_password("hdfhSFD^&f2834sad39"))
        user2 = User(email="bob@example.com", hashed_password=hash_password("hdfhSFD^&f28346"))
        user3 = User(email="alice@example.com", hashed_password=hash_password("123BCAsagcAv46q#%4GHhs$As3"))
        
        session.add_all([user1, user2, user3])
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
    
async def seed_topics(session):
    if await is_table_empty(session, Topic):
        print("Seeding Topics 🏷️")
        
        topic1 = Topic(name="Tech", description="All about technology.")
        topic2 = Topic(name="Life", description="Life experiences and stories.")
        topic3 = Topic(name="Travel", description="Travel diaries and tips.")
        topic4 = Topic(name="misc", description="")
        
        session.add_all([topic1, topic2, topic3, topic4])
        await session.commit()
        print("Topics Seeded Successfully ✅.")
    else:
        print("⚠️ topics already exist. Skipping.")

async def associate_blogs_topics(session):
    # Fetch blogs and topics
    result = await session.execute(select(Blog).options(selectinload(Blog.topics)))
    blogs = result.scalars().all()
    
    result = await session.execute(select(Topic))
    topics = result.scalars().all()
    
    topic_dict = {topic.name: topic for topic in topics}
    
    # Associate first blog with "Tech" and "Life" if it exists
    if blogs:
        blogs[0].topics.append(topic_dict.get("Tech"))
        blogs[0].topics.append(topic_dict.get("Life"))
        
    # Associate second blog with "Travel" if it exists
    if len(blogs) > 1:
        blogs[1].topics.append(topic_dict.get("Travel"))
        
    # Associate third blog with "misc" and "Tech" if it exists
    if len(blogs) > 2:
        blogs[2].topics.append(topic_dict.get("misc"))
        blogs[2].topics.append(topic_dict.get("Tech"))
        
    await session.commit()
    print("Associated Blogs with Topics ✅.")

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
            await seed_topics(session)
            await seed_blogs(session)
            await associate_blogs_topics(session)
            
    except OperationalError as e:
        if "no such table" in str(e):
            print("⚠️  DB is empty! Running Alembic migrations ...⚙️")
            subprocess.run(["alembic", "upgrade", "head"])
            print("✅ Migrations complete!")
            print("Resuming seeding ... 🪴")
            
            # ✅ Re-create the session AFTER migration!
            async with AsyncSessionLocal() as session:
                await seed_users(session)
                await seed_topics(session)
                await seed_blogs(session)
                await associate_blogs_topics(session)
        else:
            raise
    
if __name__ == '__main__':
    asyncio.run(main())
