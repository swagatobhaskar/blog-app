import Blog from "@/lib/types/blog"
import { BLOG_API_URL } from "@/lib/constants/constants"
import BlogListItem from "@/components/blog/blogListItem"
import AdminNav from "@/components/layout/adminNav";
import { GetLoggedInUser } from "@/lib/server-auth/getLoggedInUser";

export default async function Home() {
    const user = await GetLoggedInUser();
    
    const res = await fetch(
        `${BLOG_API_URL}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'default', // what will it be for blogs?
    })

    const blogs: Blog[] = await res.json()

    return (
        <div className="w-full lg:w-3/6 mx-auto px-10 mt-5 lg:mt-10">
            { user && <AdminNav /> }
            {blogs.length === 0 && <p className="font-light text-2xl">Nothing to see here...</p>}
            {blogs.map((blog) => (
                <BlogListItem key={blog.id} blog={blog} user={user} />
            ))}
        </div>  
    )
}
