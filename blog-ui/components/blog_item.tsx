import Link from "next/link"
import Topic from "@/lib/types/topic"
import Blog from "@/lib/types/blog"

export default function BlogListItem({blog}: {blog: Blog}) {
    return (
        <div key={blog.id} className="mb-4 border-b border-gray-400">
            <Link href={`/blog/${blog.id}`}>
                <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
            </Link>
            <p className="text-gray-600 text-sm mb-4">Created at: {new Date(blog.created_at).toLocaleDateString()}</p>
            <p className="text-gray-800 mb-4">{blog.content.substring(0, 200)}...</p>
            <div className="mb-4">
                {blog.topics.map((topic: Topic) => (
                    <span key={topic.id} className="inline-block bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
                        {topic.name}
                    </span>
                ))}
            </div>
        </div>
    );
}