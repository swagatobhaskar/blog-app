// server component
import { notFound } from "next/navigation"
import Blog from "@/lib/types/blog"
import {BLOG_API_URL} from "@/lib/constants/constants"
import BlogControlButtons from "@/components/blog-control-btns";

export async function generateStaticParams() {
    try {
        const res = await fetch(`${BLOG_API_URL}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json',},
            cache: 'default', // or use 'force-cache' or 'revalidate' based on your need
        });

        if (!res.ok) {
        // Return empty array if fetch fails
        return [];
        }
        
        const blogs: Blog[] = await res.json();

        return blogs.map((blog) =>({
            id: blog.id
        }))
    } catch (error) {
        // Handle network or other errors by returning empty array
        return [];
    }
}

export default async function BlogPage({params}: {params: {id: string}}) {
    // const blog_id = params.id;
    const res = await fetch(`${BLOG_API_URL}/${params.id}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json',},
        cache: "force-cache", // better performance if data updates infrequently
    });
    // Show 404 page if blog is not found
    if (!res.ok) return notFound();
    const blog: Blog = await res.json()

    return (
        <div className="w-4/5 mx-auto text-center flex flex-col gap-y-2.5">
            <div>
                <h1 className="text-5xl font-sans">{blog.title}</h1>
                <p className="text-gray-500"><i>Published on: {new Date(blog.created_at).toLocaleDateString()}</i></p>
                {/* <p className="text-lg font-sans font-normal">{blog.content}</p> */}
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }} />
                {/* <p><i>Author: {blog.author}</i></p> */}
            </div>
            <BlogControlButtons blog={blog} />
        </div>
    );
}

