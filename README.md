# FastAPI Backend Setup (Ubuntu 24)
1. Create virtual environment: `python3 -m venv env`
2. Activate the virtual env: `source env/bin/activate`
3. Install the following libraries and modules: `pip install "fastapi[standard]" psycopg2-binary asyncpg sqlalchemy alembic python-dotenv pydantic-settings`
4. Create the necessary files-- main, models, config, database, dependency, etc.
5. Run FastAPI locally with: `fastapi dev app/main.py`
6. Create SECRET_KEY from: `import secrets; secrets.token_hex(16 or 32)` !!
7. Create settings using `pydantic_settings` in `config.py`
8. Install aiosqlite, async SQLite driver for python: `pip install aiosqlite`
9. Use UUID as blog id. `import uuid; from sqlalchemy.dialects.postgresql import UUID as PG_UUID`
10. SQLAlchemy 2.x async recommends `mapped_column()`, instead of the 1.x `Column()`
11. Initialize alembic, and modify it's settings as it doesn't support async
12. Install JWT modules: `pip install python-jose[cryptography] passlib[bcrypt]` [Source: https://toxigon.com/implementing-authentication-in-fastapi]

!Write complete doc od setting up async sqlalchemy

!Tag, or Category option

> (Plan to include): Tests, CI/CD, Linting, Pre-commit-hook,
