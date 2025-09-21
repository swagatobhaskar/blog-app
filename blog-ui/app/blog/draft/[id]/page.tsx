// Server component
import { notFound } from "next/navigation";
import { BLOG_API_URL } from "@/lib/constants/constants";
import Blog from "@/lib/types/blog";
import RenderBlogAndOptionButtons from "@/components/blog/renderBlog";
import User from "@/lib/types/user";
import { GetLoggedInUser } from "@/lib/server-auth/getLoggedInUser";

export default async function DraftBlogItem({params}: {params: Promise<{ id: string }>}) {
    const { id } = await params;
    const { user } = await GetLoggedInUser();

    console.log("id, user: ", id, user);
    const res = await fetch(`${BLOG_API_URL}/draft/${id}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json',},
            cache: "no-store", // prevent stale drafts
            // cache: "default", // better performance if data updates infrequently
        });
    // Show 404 page if blog is not found
    if (!res.ok) return notFound();
    const draftBlog: Blog = await res.json()
    console.log("DRAFTBLOG: ", draftBlog)
    
    return (
        <div className="">
            <RenderBlogAndOptionButtons blog={draftBlog} user={user} />
        </div>
    )
}