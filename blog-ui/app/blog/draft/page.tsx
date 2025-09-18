// Server component
import Blog from "@/lib/types/blog"

import { BLOG_API_URL } from "@/lib/constants/constants"
import BlogListItem from "@/components/blog/blogListItem"
import { GetLoggedInUser } from "@/lib/server-auth/getLoggedInUser"
import { cookies } from "next/headers";

export default async function DraftsList() {

    const { user, accessToken } = await GetLoggedInUser();
    console.log("(in draft) RETURNED FROM GetLoggedInUser:-- ", user, accessToken)

    const fetchDraftForAuthenticatedUser = async (accessToken: string | undefined) => {
        console.log("TOKEN in draft server request: ", accessToken)
        const res = await fetch(`${BLOG_API_URL}/draft`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Cookie: `access_token=${accessToken}`,
            },
            cache: 'no-store' //'default', // what will it be for blogs?
            }
        )
        return res.json()
    }

    const draftBlogs: Blog[] = await fetchDraftForAuthenticatedUser(accessToken);
    console.log("DRAFTBLOGS: ", draftBlogs)

    if (!Array.isArray(draftBlogs)) {
        return <p className="text-red-500">Failed to load drafts</p>;
    }
    
    return (
        <div className="w-full lg:w-3/6 mx-auto">
            <h1 className="text-center text-2xl font-light my-5">Draft Blogs</h1>
            <div className="px-10 mt-5 lg:mt-10">
                {draftBlogs.length === 0 ? (
                    <p className="text-center text-gray-500">Nothing saved as draft!</p>
                ) : (
                    draftBlogs.map((blog) => (
                        <BlogListItem key={blog.id} blog={blog} user={user} />
                    ))
                )}
            </div>
        </div>  
    )
}
