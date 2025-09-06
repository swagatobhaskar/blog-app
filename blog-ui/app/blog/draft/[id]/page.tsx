// Server component
import { notFound } from "next/navigation";
import { BLOG_API_URL } from "@/lib/constants/constants";
import Blog from "@/lib/types/blog";
import BlogControlButtons from "@/components/blog-control-btns";

export default async function DraftBlogItem({params}: {params: {id: string}}) {
    const res = await fetch(`${BLOG_API_URL}/draft/${params.id}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json',},
            cache: "force-cache", // better performance if data updates infrequently
        });
        // Show 404 page if blog is not found
        if (!res.ok) return notFound();
    const draftBlog: Blog = await res.json()
    
    return (
        <div key={draftBlog.id} className="">
            <div className="text-center">
                <h1 className="text-3xl">{draftBlog.title}</h1>
                {/* <div className="prose max-w-none">{draftBlog.content}</div> */}
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: draftBlog.content }} />
            </div>
            <BlogControlButtons blog={draftBlog} />
        </div>
    )
}