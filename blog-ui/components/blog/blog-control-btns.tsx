'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import Blog from "@/lib/types/blog";
import ButtonCancel from "@/components/ui/buttons/button-cancel";
import ButtonSecondary from "@/components/ui/buttons/button-secondary";
import ButtonPrimary from "@/components/ui/buttons/button-primary";
import { BLOG_API_URL } from "@/lib/constants/constants";
import HandleAction from "@/lib/handleAction";
import { createBlog, publishDraftedBlog, savePublishedBlogAsDraft } from "@/lib/api/apiBlog";

export default function BlogControlButtons({blog}: {blog: Blog}) {
    const router = useRouter()
    const [ loading, setLoading ] = useState<boolean>(false)

    const handlePublishBlog = async () => {
        // const {id} = blog.id;
        const { data, error, success } = await HandleAction<Blog>(
            () => publishDraftedBlog(blog.id), 
            {
                setLoading,
                successMessage: "Blog published from draft.",
                errorMessage: "Could not publish blog.. please try again!"
            }
        )

        if (data) { // (success && data)
            router.refresh()
            // do something if needed
            // e.g.
            // Success: proceed with next steps
            // router.push(`/blog/${data.slug}`); // Navigate to the new blog
            // console.log('New blog created:', data);
        }

        // Use error if you want extra error handling (optional)
        // You usually don’t need this if you're showing toasts, but you can:

        if (error) {
        // Optional: custom logging or behavior
        // console.error('Blog submission error:', error);
        // e.g. show detailed UI error message
        }
        
        // try {
        //     setIsLoading(true)
        //     const res = await fetch(`${BLOG_API_URL}/${blog.id}`, {
        //         method: 'PATCH',
        //         body: JSON.stringify({"is_draft": false}),
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     })
        //     if (!res.ok) {return}
        //     else {router.refresh()}
        // } catch (err) {
        //     console.error(err)
        // } finally {
        //     setIsLoading(false)
        // }
    }

    const handleSaveBlogAsDraft = async () => {
        try {
            setLoading(true)
            const res = await fetch(`${BLOG_API_URL}/${blog.id}`, {
                method: 'PATCH',
                body: JSON.stringify({"is_draft": true}),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!res.ok) {return}
            else {router.push(`/`)}
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteBlog = async () => {
        try {
            setLoading(true)
            const res = await fetch(`${BLOG_API_URL}/${blog.id}`, {
                method: "DELETE"
            })
            if (res.ok) {
                router.refresh()
                // show toast "DELETED"
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            { blog.is_draft ? (
                <div className="w-[50%] flex flex-row justify-evenly">
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
                </div>
            ) : (
                <div className="w-[50%] flex flex-row justify-evenly">
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
                </div>
            )}
        </>
    )
}
