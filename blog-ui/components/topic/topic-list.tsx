'use client'

import Topic from "@/lib/types/topic"

export default function TopicList({topics}: {topics: Topic[]}) {
    return (
        <div className="mb-4">
            {topics.map((topic: Topic) => (
                <span key={topic.id} className="inline-block bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
                    {topic.name}
                </span>
            ))}
        </div>
    )
}
