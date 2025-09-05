'use client'

import { useState } from "react"
import dynamic from "next/dynamic"

import ButtonCancel from "./ui/button-cancel"
import ButtonPrimary from "./ui/button-primary"
import ButtonSecondary from "./ui/button-secondary"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

export const QuillEditor = dynamic(() => import('@/components/quillEditor'), {ssr: false})

interface BlogFormProps {
    initialTitle?: string;
    initialContent?: string;
    onSaveDraft: (title: string, content: string) => void;
    onPublish: (title: string, content: string) => void;
    onCancel: () => void;
}

export default function BlogForm({
  initialTitle = '',
  initialContent = '',
  onSaveDraft,
  onPublish,
  onCancel,
}: BlogFormProps) {
    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent);

    const handleDraft = () => onSaveDraft(title, content);
    const handlePublish = () => onPublish(title, content);
    const handleCancel = () => onCancel();

    const handleChange = (html: string) => {
        setContent(html)        
    }

    return (
        <div className="mx-auto w-full lg:max-w-[70vw]"> {/*w-full md:mx-w-[60vw] lg:max-w-[50vw] mx-auto */}
            <h2 className="italic text-2xl font-semibold mb-2 text-center">{initialTitle ? 'Edit Blog' : 'Write a New Blog'}</h2>
            <Label className="text-lg">Title</Label>
            <Input
                type="text"
                id="title"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 mb-4 text-lg"
            />
            <QuillEditor onChange={handleChange} value={content} />
            {/* Draft/Publish */}
            <div className="flex flex-row gap-4 justify-center lg:justify-end mt-2">
                <ButtonCancel text="Cancel" onclick={handleCancel} />
                <ButtonSecondary text="Save Draft" onclick={handleDraft} />
                <ButtonPrimary text="Publish" onclick={handlePublish} />
            </div>
            <h2>Live Preview:</h2>
            <div dangerouslySetInnerHTML={{ __html: content}} />
        </div>
    )
}
