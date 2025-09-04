'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import BlogForm from "@/components/blog-form";
import TopicSelection from "@/components/topic-selection";
import Topic from "@/lib/types/topic";

import SubmitBlog from "@/lib/submitBlogHelper";

export default function NewBlogPage() {
    const router = useRouter()
    const [ topicsToUse, setTopicsToUse ] = useState<Topic[]>([])
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    
    const handleSaveDraft = async (title: string, content: string) => {
        alert("Draft clicked!")
        const new_blog = await SubmitBlog({title, content, isDraft: true, topicsToUse: topicsToUse });
        router.push(`/blog/draft/${new_blog.id}`);
    }

    const handlePublish = async (title: string, content: string) => {
        // alert("Publish clicked!")
        setIsSubmitting(true)
        try {
            const new_blog = await SubmitBlog({ title, content, isDraft: false, topicsToUse: topicsToUse });
            router.push(`/blog/${new_blog.id}`);
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancel = () => {
        // alert("Cancel Clicked!")
        router.refresh()
    }

    return (
        <div className="flex flex-col lg:flex-row justify-between w-full lg:w-[80%] lg:mx-auto">
            <div className="px-4 mt-10 w-full lg:w-1/4">
                <TopicSelection onChangeSelectedTopics={setTopicsToUse} />
            </div>
            <div className="w-full lg:w-3/4">
                { isSubmitting && <p>Saving...</p> }
                <BlogForm
                    onPublish={handlePublish}
                    onSaveDraft={handleSaveDraft}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    )
}
