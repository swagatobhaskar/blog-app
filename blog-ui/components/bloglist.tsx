// Server Component

import Link from "next/link"

import { Blog } from "@/lib/types/blog"
import { Topic } from "@/lib/types/topic"
import { BLOG_API_URL } from "@/lib/constants/constants"

export default async function BlogListComponent() {

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
                <div key={blog.id} className="mb-4 border-b border-gray-400">
                    <Link href={`/blog/${blog.id}`}>
                        <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
                    </Link>
                    <p className="text-gray-600 text-sm mb-4">Created at: {new Date(blog.created_at).toLocaleDateString()}</p>
                    <p className="text-gray-800 mb-4">{blog.content.substring(0, 200)}...</p>
                    <div className="mb-4">
                        {blog.topics.map((topic: Topic) => (
                            <span key={topic.id} className="inline-block bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
                                {topic.name}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>  
    )
}
