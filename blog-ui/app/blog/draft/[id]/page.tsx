// Server component
import { notFound } from "next/navigation";
import { BLOG_API_URL } from "@/lib/constants/constants";
import Blog from "@/lib/types/blog";
import RenderBlogAndOptionButtons from "@/components/blog/render_blog";

export default async function DraftBlogItem({params}: {params: {id: string}}) {
    const { id } = params;
    const res = await fetch(`${BLOG_API_URL}/draft/${id}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json',},
            cache: "default", // better performance if data updates infrequently
        });
        // Show 404 page if blog is not found
        if (!res.ok) return notFound();
    const draftBlog: Blog = await res.json()
    
    return (
        <div className="">
            <RenderBlogAndOptionButtons blog={draftBlog} />
        </div>
    )
}