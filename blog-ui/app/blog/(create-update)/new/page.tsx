'use client'

import BlogForm from "@/components/blog-form";

export default function Home() {

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
        <BlogForm
            onPublish={handlePublish}
            onSaveDraft={handleSaveDraft}
            onCancel={handleCancel}
        />
    )
}
