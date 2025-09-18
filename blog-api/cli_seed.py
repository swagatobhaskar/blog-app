import sys
# import argparse
import asyncio
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from app.database.session import engine, AsyncSessionLocal, Base
from app.database.models import User, Blog, Topic
from app.utils.security import hash_password

# If tables are not created yet, run this once to create the tables:
# DON'T RUN THESE IF USING ALEMBIC
# async def init_models():
#     async with engine.begin() as conn:
#         await conn.run_sync(Base.metadata.drop_all)  # Optional: drop tables first
#         await conn.run_sync(Base.metadata.create_all)

# ---------------------------------------------------
# Users
async def create_user(email, password):
    async with AsyncSessionLocal() as session:
        hash_p = hash_password(password)
        new_user = User(email=email, hashed_password=hash_p)
        session.add(new_user)
        await session.commit()
        await session.refresh(new_user)
        return new_user

async def get_users():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User))
        return result.scalars().all()

# ---------------------------------------------------
# Topics
async def create_topic(name, description=None):
    async with AsyncSessionLocal() as session:
        new_topic = Topic(name=name, description=description or "")
        session.add(new_topic)
        await session.commit()
        await session.refresh(new_topic)
        return new_topic
    
async def get_topics():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Topic))
        return result.scalars().all()

# ---------------------------------------------------
# Blogs
async def create_blog():
    import uuid
    
    title: str = input("Title: ")
    content: str = input("Content: ")
    
    async with AsyncSessionLocal() as session:
        author_result = await session.execute(
            select(User).where(User.id==uuid.UUID("cd1893ce-bd8e-4efe-ae1a-6f8df1203458"))
        )
        author = author_result.scalar_one_or_none()
        
        new_blog = Blog(title=title, content=content, author=author)
        session.add(new_blog)
        await session.commit()
        await session.refresh(new_blog)
        return new_blog
    
async def blog_list():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Blog))
        return result.scalars().all()


async def main():
    if len(sys.argv) < 2:   # if required arguments aren't provided
        print("Usage:")
        # print("  python cli_seed.py init")
        print("  python cli_seed.py user_create <email> <password>")
        print("  python cli_seed.py user_list")
        print("---" * 20)
        print("  python cli_seed.py topic_create")
        print("  python cli_seed.py topic_list")
        print("---" * 20)
        print("  python cli_seed.py blog_create")
        print("  python cli_seed.py blog_list")
        return
    
    command = sys.argv[1]   # the command is after the script name
    
    # if command == "init":
    #     await init_models()
    #     print("Tables created")
    
    if command == "user_create":
        if len(sys.argv) < 3:
            print("Please provide an email & password: ")
            return
        email_from_args = sys.argv[2]
        password_from_args = sys.argv[3]
        user = await create_user(email=email_from_args, password=password_from_args)
        print(f"User created: ID={user.id}, Email={user.email}")
    
    elif command == "user_list":
        users = await get_users()
        for user in users:
            print(f"ID={user.id}, Email={user.email}")
            
    elif command == "topic_create":
        name = input("Topic Name: ")
        description = input("Description (optional): ")
        try:
            topic = await create_topic(name=name, description=description)
            print(f"Topic created: ID={topic.id}, Name={topic.name}")
        except IntegrityError:
            print(f"Topic with name '{name}' already exists.")
    
    elif command == "topic_list":
        topics = await get_topics()
        for topic in topics:
            print(f"ID={topic.id}, Name={topic.name}")
    
    elif command == "blog_create":
        await create_blog()
        print(f"New blog created.")
        
    elif command == "blog_list":
        blogs = await blog_list()
        for blog in blogs:
            print(f"ID={blog.id}, Title={blog.title}")
    else:
        print(f"Unknown command: {command}")
        
        
if __name__ == '__main__':
    asyncio.run(main())
    