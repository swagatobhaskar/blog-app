'use client'

import { useState } from "react";
import BlogForm from "@/components/blog-form";
import TopicSelection from "@/components/topic-selection";
import Topic from "@/lib/types/topic";

export default function NewBlogPage() {
    const [ topicsToUse, setTopicsToUse ] = useState<Topic[]>([])

    const handleSaveDraft = async (title: string, content: string) => {
        alert("Draft clicked!")
    }

    const handlePublish = async (title: string, content: string) => {
        alert("Publish Clicked!")
    }

    const handleCancel = async () => {
        alert("Cancel Clicked!")
    }

    return (
        <div className="flex flex-col lg:flex-row justify-between w-full lg:w-[80%] lg:mx-auto">
            <div className="px-4 mt-10 w-full lg:w-1/4">
                <TopicSelection onChangeSelectedTopics={setTopicsToUse} />
            </div>
            <div className="w-full lg:w-3/4">
                <BlogForm
                    onPublish={handlePublish}
                    onSaveDraft={handleSaveDraft}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    )
}
