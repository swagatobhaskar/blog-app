'use client'

import { useState } from "react"
import dynamic from "next/dynamic";
import ButtonSecondary from "@/components/ui/button-secondary";
import ButtonPrimary from "@/components/ui/button-primary";
import ButtonCancel from "@/components/ui/button-cancel";
// import EditorPage from "./components/EditorPage";

const QuillEditor = dynamic(() => import('@/components/quillEditor'), {ssr: false})

export default function Home() {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    const handleChange = (html: string) => {
        setContent(html)        
    }

    const saveDraft = async () => {
        alert("Draft clicked!")
    }

    const handlePublish = async () => {
        alert("Publish Clicked!")
    }

    const handleCancel = async () => {
        alert("Cancel Clicked!")
    }

    return (
        <div className="w-full md:mx-w-[60vw] lg:max-w-[50vw] mx-auto">
            <h2 className="italic text-2xl font-semibold mb-2 text-center">Write a new blog</h2>
            <input
                type="text"
                id="title"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 mb-4 text-lg"
            />
            <QuillEditor onChange={handleChange} value={content} />
            {/* Draft/Publish */}
            <div className="flex flex-row gap-4 justify-end mt-2">
                <ButtonCancel text="Cancel" onclick={handleCancel} />
                <ButtonSecondary text="Draft" onclick={saveDraft} />
                <ButtonPrimary text="Publish" onclick={handlePublish} />
            </div>
            <h2>Live Preview:</h2>
            <div dangerouslySetInnerHTML={{ __html: content}} />
        </div>
    )
}
