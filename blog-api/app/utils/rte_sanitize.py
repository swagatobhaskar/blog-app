import nh3
from app.config import get_settings

settings = get_settings()

def sanitize(blog_content: str):
    clean_rte_content = nh3.clean(
        blog_content,
        tags=settings.allowed_tags,
        attributes=settings.allowed_attrs,
        strip=True,
    )
    return clean_rte_content
