'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import DOMPurify from "isomorphic-dompurify"
import BlogForm from "@/components/blog/blogForm";
import TopicSelection from "@/components/topic/topicSelection";
import Topic from "@/lib/types/topic";
import { createBlogAndPublish, createBlogAsDraft } from "@/lib/api/apiBlog";
import HandleAction from "@/lib/handleAction";
import { validateBlogInput } from "@/utils/validateFormFields";

export default function NewBlogPage() {
    const router = useRouter()
    const [ topicsToUse, setTopicsToUse ] = useState<Topic[]>([])
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ userErrors, setUserErrors ] = useState<string[]>([]);
    
    const handleSaveDraft = async (title: string, content: string) => {
        if (!validateBlogInput(title, content, setUserErrors)) return;
        // if (!title.trim()) {
        //     setUserErrors(prev => prev.includes("Title is required!") // prevents duplication
        //         ? prev : [...prev, "Title is required!"]
        //     )
        //     return;
        // }
    
        // if (!content.trim()) {
        //     setUserErrors(prev => prev.includes("Content is required")
        //         ? prev : [...prev, "Content is required!"]
        //     )
        //     return;
        // }
        const sanitized_content = DOMPurify.sanitize(content);

        const { data, error, success } = await HandleAction(
            () => createBlogAsDraft(title, sanitized_content, topicsToUse),
            {
                setLoading: setIsSubmitting,
                successMessage: "Blog published from draft.",
                errorMessage: "Could not publish blog.. please try again!"
            }
        )
        if (success && data) {router.push(`/blog/draft/${data.id}`)}
    }

    const handlePublish = async (
        title: string,
        content: string,
    ) => {
        if (!validateBlogInput(title, content, setUserErrors)) return;
        const sanitized_content = DOMPurify.sanitize(content);
        
        const { data, error, success } = await HandleAction(
            () => createBlogAndPublish(title, sanitized_content, topicsToUse),
            {
                setLoading: setIsSubmitting,
                successMessage: "Blog published.",
                errorMessage: "Could not publish blog.. please try again!"
            }
        )
        if (success && data) {
            // Assuming `data` contains the newly created blog, and it has an `id`
            router.push(`/blog/${data.id}`)
        } else {
            // Handle error if needed
            console.error("Blog creation failed:", error);
        }
    }

    const handleCancel = () => {
        // alert("Cancel Clicked!")
        router.back()
    }

    return (
        <div className="flex flex-col lg:flex-row justify-between w-full lg:w-[90%] lg:mx-auto">
            <div className="px-4 mt-10 w-full lg:w-1/6">
                <TopicSelection onChangeSelectedTopics={setTopicsToUse} />
            </div>
            <div className="w-full lg:w-5/6">
                { isSubmitting && <p>Saving...</p> }
                <BlogForm
                    mode="new"
                    onPublish={handlePublish}
                    onSaveDraft={handleSaveDraft}
                    onCancel={handleCancel}
                    userErrors={userErrors.length > 0 ? userErrors : []}
                />
            </div>
        </div>
    )
}
