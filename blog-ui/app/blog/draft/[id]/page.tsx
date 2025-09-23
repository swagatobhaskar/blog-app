// Server component
import { notFound } from "next/navigation";
import { DRAFT_BLOG_API_URL } from "@/lib/constants/constants";
import Blog from "@/lib/types/blog";
import RenderBlogAndOptionButtons from "@/components/blog/renderBlog";
import { GetLoggedInUser } from "@/lib/server-utils/getLoggedInUser";
import ServerFetchHandler from "@/lib/server-utils/serverFetchHandler";

export default async function DraftBlogItem({params}: {params: Promise<{ id: string }>}) {
    const { id } = await params;
    const { user } = await GetLoggedInUser();

    // console.log("id, user: ", id, user);
    // const res = await fetch(`${BLOG_API_URL}/draft/${id}`, {
    //         method: 'GET',
    //         headers: {'Content-Type': 'application/json',},
    //         cache: "no-store", // prevent stale drafts
    //         // cache: "default", // better performance if data updates infrequently
    //     });

    const draftBlogResp: Response = await ServerFetchHandler({ url: `${DRAFT_BLOG_API_URL}/${id}` })
    const draftBlog: Blog = await draftBlogResp.json()

    // Show 404 page if blog is not found
    if (!draftBlog) return notFound();
    // console.log("DRAFTBLOG: ", draftBlog)
    
    return (
        <div className="">
            <RenderBlogAndOptionButtons blog={draftBlog} user={user} />
        </div>
    )
}