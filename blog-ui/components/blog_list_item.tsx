import Link from "next/link"
import Topic from "@/lib/types/topic"
import Blog from "@/lib/types/blog"
import BlogControlButtons from "./blog-control-btns";

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
            <div className="mb-4">
                {blog.topics.map((topic: Topic) => (
                    <span key={topic.id} className="inline-block bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
                        {topic.name}
                    </span>
                ))}
            </div>
            <BlogControlButtons blog={blog} />
        </div>
    );
}