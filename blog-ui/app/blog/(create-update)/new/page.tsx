'use client'

import BlogForm from "@/components/blog-form";
import CategorySelection from "@/components/category-selection";

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
        <div className="flex flex-row justify-between w-full">
            <div className="px-4 mt-10 flex-1/4">
                <CategorySelection />
            </div>
            <div className="flex-3/4">
                <BlogForm
                    onPublish={handlePublish}
                    onSaveDraft={handleSaveDraft}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    )
}
