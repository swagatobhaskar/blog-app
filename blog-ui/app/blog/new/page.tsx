'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import BlogForm from "@/components/blog/blog-form";
import TopicSelection from "@/components/topic/topic-selection";
import Topic from "@/lib/types/topic";
import { createBlog, createBlogAsDraft } from "@/lib/api/apiBlog";
import HandleAction from "@/lib/handleAction";

export default function NewBlogPage() {
    const router = useRouter()
    const [ topicsToUse, setTopicsToUse ] = useState<Topic[]>([])
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ userErrors, setUserErrors ] = useState<string[]>([]);
    
    const handleSaveDraft = async (title: string, content: string) => {
        if (!title.trim()) {
            setUserErrors(prev => prev.includes("Title is required!") // prevents duplication
                ? prev : [...prev, "Title is required!"]
            )
            return;
        }
    
        if (!content.trim()) {
            setUserErrors(prev => prev.includes("Content is required")
                ? prev : [...prev, "Content is required!"]
            )
            return;
        }
        const { data, error, success } = await HandleAction(
            () => createBlogAsDraft(title, content, topicsToUse),
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
        if (!title.trim()) {
            setUserErrors(prev => prev.includes("Title is required!") // prevents duplication
                ? prev : [...prev, "Title is required!"]
            )
            return;
        }
    
        if (!content.trim()) {
            setUserErrors(prev => prev.includes("Content is required")
                ? prev : [...prev, "Content is required!"]
            )
            return;
        }

        const { data, error, success } = await HandleAction(
            () => createBlog(title, content, topicsToUse),
            {
                setLoading: setIsSubmitting,
                successMessage: "Blog published.",
                errorMessage: "Could not publish blog.. please try again!"
            }
        )
        if (success && data) {
            // Assuming `data` contains the newly created blog, and it has an `id`
            console.log("HandlePublish DATA:: ", data);
            router.push(`/blog/${data.id}`)
        } else {
            // Handle error if needed
            console.error("Blog creation failed:", error);
        }
    }

    const handleCancel = () => {
        // alert("Cancel Clicked!")
        router.refresh()
    }

    return (
        <div className="flex flex-col lg:flex-row justify-between w-full lg:w-[90%] lg:mx-auto">
            <div className="px-4 mt-10 w-full lg:w-1/6">
                <TopicSelection onChangeSelectedTopics={setTopicsToUse} />
            </div>
            <div className="w-full lg:w-5/6">
                { isSubmitting && <p>Saving...</p> }
                <BlogForm
                    onPublish={handlePublish}
                    onSaveDraft={handleSaveDraft}
                    onCancel={handleCancel}
                    userErrors={userErrors.length > 0 ? userErrors : []}
                />
            </div>
        </div>
    )
}
