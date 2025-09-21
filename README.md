Sample users:
    john@example.com, hdfhSFD^&f2834sad39
    bob@example.com, hdfhSFD^&f28346
    alice@example.com, 123BCAsagcAv46q#%4GHhs$As3

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

> (Plan to include): Tests, CI/CD, Linting, Pre-commit-hook,

npm install gray-matter remark remark-html, to parse .md and convert it to HTML.

> Installed Quill rich text editor: $ npm install quill@2.0.3
> Installed uuid with: $ npm install uuid

Install Isomorphic-Dompurify: `npm install isomorphic-dompurify`

On FastAPI, for sanitization- `pip install nh3`

install react-hook-form, zodresolver, zod: `npm install react-hook-form`, `npm install @hookform/resolvers`, `npm install zod`.

### To Implement Next:
- Rating/Reactions,
- RTE pic upload,
- pagination,
- contact form,
- beautify blog display,
- place blog control buttons on the top right beside title,
- Add CSRF dependency in fastapi,
- Remove or shorten HandleAction().
- Document design principles in design-guide.md,
- Refreshing page after a long time is rendering logging out matters, but cookies are present!
  (REFRESH-TOKEN URL ISN'T FIRING AT ALL, MAY BE, DURING HARD REFRESH!!)
  After some time, logged-in matters are rendering again, I think I saw correct! Yes, that's correct. Could be hydration issue.
  But, hard refreshing again causes the same issue! And NO call to API refresh-token too!
- make app/blog/draft/page.tsx a client component? May be, because it requires authenticated requests.
  But, protected pages can be server components, as I saw!
  Is the same required for `app/blog/draft/[id]/page.tsx`?
- actions vs client side fetch when httponly cookies are involved!
- 