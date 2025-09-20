'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePathname } from 'next/navigation'
import Blog from "@/lib/types/blog";
import ButtonCancel from "@/components/ui/buttons/buttonCancel";
import ButtonSecondary from "@/components/ui/buttons/buttonSecondary";
import ButtonPrimary from "@/components/ui/buttons/buttonPrimary";
import HandleAction from "@/lib/handleAction";
import { publishDraftedBlog, savePublishedBlogAsDraft, deleteBlog } from "@/lib/api/apiBlog";

export default function BlogControlButtons({blog}: {blog: Blog}) {
    const router = useRouter()
    const pathName = usePathname()
    const [ loading, setLoading ] = useState<boolean>(false)

    const handlePublishBlog = async () => {
        const { data, error, success } = await HandleAction<Blog>(
            () => publishDraftedBlog(blog.id), 
            {
                setLoading,
                successMessage: "Blog published from draft.",
                errorMessage: "Could not publish blog.. please try again!"
            }
        )

        if (success && data) {
            router.refresh()
            // Success: proceed with next steps
            // do something if needed            
        }

        // Use error if you want extra error handling (optional)
        // You usually don’t need this if you're showing toasts, but you can:

        if (error) {
        // Optional: custom logging or behavior
        // console.error('Blog submission error:', error);
        // e.g. show detailed UI error message
        }
    }

    const handleSaveBlogAsDraft = async () => {
        const { data, error, success } = await HandleAction(
            () => savePublishedBlogAsDraft(blog.id), 
            {
                setLoading,
                successMessage: "Blog saved as draft.",
                errorMessage: "Could not save as draft.. please try again!"
            }
        )

        if (data) {router.push('/')}
    }

    const handleDeleteBlog = async () => {
        const { data, error, success } = await HandleAction(
            ()=> deleteBlog(blog.id),
            {
                setLoading,
                successMessage: "Blog deleted successfully.",
                errorMessage: "Could not delete blog.. please try again!"
            }
        )
        if (data) {router.refresh()}
    }

    // Define the pattern for matching `/blog/<id>` (UUID-like format)
    const pattern = /^\/blog\/[a-f0-9\-]{36}$/;
    const isBlogPostPath = pattern.test(pathName)
    
    return (
        <div className={`w-[90%] flex justify-evenly ${isBlogPostPath ? 'flex-col' : 'flex-row'}`}>
            { blog.is_draft ? (
                <>
                    <ButtonCancel
                        text="Delete"
                        onClick={handleDeleteBlog}
                        disabled={loading}
                    />
                    <ButtonSecondary
                        text="Edit"
                        onClick={() => router.push(`/blog/${blog.id}/edit`)}
                        disabled={loading}
                    />
                    <ButtonPrimary
                        // text="Publish"
                        text={loading ? "Publishing..." : "Publish"}
                        onClick={handlePublishBlog}
                        disabled={loading}
                    />
                </>
            ) : (
                <>
                    <ButtonCancel
                        text="Delete"
                        onClick={handleDeleteBlog}
                        disabled={loading}
                    />
                    <ButtonSecondary
                        text="Edit"
                        onClick={() => {
                            router.push(`/blog/${blog.id}/edit`)}
                        }
                        disabled={loading}
                    />
                    <ButtonPrimary
                        text={loading ? "Saving to Drafts..." : "Save to Drafts"}
                        // text="Send to Drafts"
                        onClick={handleSaveBlogAsDraft}
                        disabled={loading}
                    />
                </>
            )}
        </div>
    )
}
