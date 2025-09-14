import Link from "next/link"
import Blog from "@/lib/types/blog"
import BlogControlButtons from "./blogControlBtns";
import TopicList from "../topic/topicList";

export default function BlogListItem({blog}: {blog: Blog}) {
    return (
        <div key={blog.id} className="mb-4 py-4 border-b border-gray-200">
            { blog.is_draft ? (
                <Link href={`/blog/draft/${blog.id}`}>
                    <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
                </Link>
            ) : (
                <Link href={`/blog/${blog.id}`}>
                    <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
                </Link>
            )}
            <p className="text-gray-600 text-sm mb-4">Created at: {new Date(blog.created_at).toLocaleDateString()}</p>
            <p className="text-gray-800 mb-4">{blog.content.substring(0, 200)}...</p>
            {/* Show subheading instead of innerhtml string*/}
            <TopicList topics={blog.topics} />
            <BlogControlButtons blog={blog} />
        </div>
    );
}
