import Blog from "@/lib/types/blog"

import { BLOG_API_URL } from "@/lib/constants/constants"
import BlogListItem from "@/components/blog_list_item"

export default async function DraftsList() {
  const res = await fetch(
        `${BLOG_API_URL}/draft`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'default', // what will it be for blogs?
        }
    )

    const draftBlogs: Blog[] = await res.json()

    return (
        <div className="w-full lg:w-3/6 mx-auto px-10 mt-5 lg:mt-10">
            {draftBlogs.map((blog) => (
                <BlogListItem key={blog.id} blog={blog} />
            ))}
        </div>  
    )
}
