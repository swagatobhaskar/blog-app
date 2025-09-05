// Server component
import { Key } from "react";
import { BLOG_API_URL } from "@/lib/constants/constants";
import Blog from "@/lib/types/blog";

export default async function DraftBlogItem({param}: {param: Key}) {
    const res = await fetch(`${BLOG_API_URL}/draft/${param}`)
    const draftBlog: Blog = res.json()

    return (
        <div key={draftBlog.id} className="">
            <h1 className="text-3xl">{draftBlog.title}</h1>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: draftBlog.content }} />
        </div>
    )
}