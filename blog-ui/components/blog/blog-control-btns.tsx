'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import Blog from "@/lib/types/blog";
import ButtonCancel from "@/components/ui/buttons/button-cancel";
import ButtonSecondary from "@/components/ui/buttons/button-secondary";
import ButtonPrimary from "@/components/ui/buttons/button-primary";
import { BLOG_API_URL } from "@/lib/constants/constants";

export default function BlogControlButtons({blog}: {blog: Blog}) {
    const router = useRouter()
    const [ isLoading, setIsLoading ] = useState<boolean>(false)

    const handlePublishBlog = async () => {
        try {
            setIsLoading(true)
            const res = await fetch(`${BLOG_API_URL}/${blog.id}`, {
                method: 'PATCH',
                body: JSON.stringify({"is_draft": false}),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!res.ok) {return}
            else {router.refresh()}
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSaveBlogAsDraft = async () => {
        try {
            setIsLoading(true)
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
            setIsLoading(false)
        }
    }

    const handleDeleteBlog = async () => {
        try {
            setIsLoading(true)
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
            setIsLoading(false)
        }
    }

    return (
        <>
            { blog.is_draft ? (
                <div className="w-[50%] flex flex-row justify-evenly">
                    <ButtonCancel
                        text="Delete"
                        onClick={handleDeleteBlog}
                        disabled={isLoading}
                    />
                    <ButtonSecondary
                        text="Edit"
                        onClick={() => router.push(`/blog/${blog.id}/edit`)}
                        disabled={isLoading}
                    />
                    <ButtonPrimary
                        // text="Publish"
                        text={isLoading ? "Publishing..." : "Publish"}
                        onClick={handlePublishBlog}
                        disabled={isLoading}
                    />
                </div>
            ) : (
                <div className="w-[50%] flex flex-row justify-evenly">
                    <ButtonCancel
                        text="Delete"
                        onClick={handleDeleteBlog}
                        disabled={isLoading}
                    />
                    <ButtonSecondary
                        text="Edit"
                        onClick={() => {
                            router.push(`/blog/${blog.id}/edit`)}
                        }
                        disabled={isLoading}
                    />
                    <ButtonPrimary
                        text={isLoading ? "Saving to Drafts..." : "Save to Drafts"}
                        // text="Send to Drafts"
                        onClick={handleSaveBlogAsDraft}
                        disabled={isLoading}
                    />
                </div>
            )}
        </>
    )
}
