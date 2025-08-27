import Blog from "@/lib/types/blog"

import { BLOG_API_URL } from "@/lib/constants/constants"
import BlogListItem from "@/components/blog_item"

export default async function Home() {
  const res = await fetch(
        // `${process.env.NEXT_PUBLIC_API_URL}/blog`,
        BLOG_API_URL,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'default', // what will it be for blogs?
        }
    )

    const blogs: Blog[] = await res.json()

    return (
        <div className="">
            {blogs.map((blog) => (
                <BlogListItem key={blog.id} blog={blog} />
            ))}
        </div>  
    )
}
