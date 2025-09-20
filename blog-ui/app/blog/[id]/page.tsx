// server component
import { notFound } from "next/navigation"
import Blog from "@/lib/types/blog"
import {BLOG_API_URL} from "@/lib/constants/constants"
import RenderBlogAndOptionButtons from "@/components/blog/renderBlog";
import { GetLoggedInUser } from "@/lib/server-auth/getLoggedInUser";

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

    const { user } = await GetLoggedInUser()
    // console.log("USER in blog/[id]/page.tsx: ", user);
    
    const {id} = params   // const { id } = params
    const res = await fetch(`${BLOG_API_URL}/${id}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json',},
        cache: "default", // better performance if data updates infrequently
    });
    // Show 404 page if blog is not found
    if (!res.ok) return notFound();
    const blog: Blog = await res.json()

    return (
        <div className="w-4/5 mx-auto text-center flex flex-col gap-y-2.5">
            <RenderBlogAndOptionButtons blog={blog} user={user} />
        </div>
    );
}
