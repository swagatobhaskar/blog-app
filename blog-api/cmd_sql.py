import sys
import asyncio
from random import randint
from sqlalchemy import select
from app.database.session import engine, AsyncSessionLocal, Base
from app.database.models import User

# If tables are not created yet, run this once to create the tables:
async def init_models():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)  # Optional: drop tables first
        await conn.run_sync(Base.metadata.create_all)

async def create_user(email):
    async with AsyncSessionLocal() as session:
        rand_digits = randint(100, 1000)
        hash_p = f"134732reehr4h7ry4hued{rand_digits}"
        new_user = User(email=email, hashed_password=hash_p)
        session.add(new_user)
        await session.commit()
        await session.refresh(new_user)
        return new_user

async def get_users():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User))
        return result.scalars().all()


async def main():
    if len(sys.argv) < 2:   # if required arguments aren't provided
        print("Usage:")
        print("  python run_user_ops.py init")
        print("  python run_user_ops.py create <email>")
        print("  python run_user_ops.py list")
        return
    
    command = sys.argv[1]   # the command is after the script name
    
    if command == "init":
        await init_models()
        print("Tables created")
    
    elif command == "create":
        if len(sys.argv) < 3:
            print("Please provide an email.")
            return
        email = sys.argv[2]
        user = await create_user(email=email)
        print(f"User created: ID={user.id}, Email={user.email}")
    
    elif command == "list":
        users = await get_users()
        for user in users:
            print(f"ID={user.id}, Email={user.email}")
    else:
        print(f"Unknown command: {command}")
        
        
if __name__ == '__main__':
    asyncio.run(main())
    