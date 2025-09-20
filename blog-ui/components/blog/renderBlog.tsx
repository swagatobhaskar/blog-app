'use client'

import DOMPurify from "isomorphic-dompurify"
import Blog from "@/lib/types/blog"
import TopicList from "../topic/topicList"
import BlogControlButtons from "./blogControlBtns"
import User from "@/lib/types/user"

interface BlogAndUserprops {
    blog: Blog;
    user: User | null;
}

export default function RenderBlogAndOptionButtons({blog, user}: BlogAndUserprops) {
    const safeHTMLContent = DOMPurify.sanitize(blog.content);

    return (
        <div key={blog.id} className="">    {/*w-4/5 mx-auto text-center flex flex-col gap-y-2.5*/}
            <div className="text-center">
                <h1 className="text-3xl">{blog.title}</h1>  {/* text-5xl font-sans */}
                <p className="text-gray-500"><i>Published on: {new Date(blog.created_at).toLocaleDateString()}</i></p>
                {/* <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: draftBlog.content }} /> */}
                <div className="flex justify-center px-4">
                    <div className="prose prose-lg dark:prose-invert max-w-3xl text-left">
                        <div dangerouslySetInnerHTML={{ __html: safeHTMLContent }} />
                    </div>
                </div>
                <TopicList topics={blog.topics} />
            </div>
            { user && (
                <div className="float-right">
                    <BlogControlButtons blog={blog} />
                </div>    
            )}
        </div>
    )
}
