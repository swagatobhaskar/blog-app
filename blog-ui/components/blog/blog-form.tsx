'use client'

import { useState } from "react"
import dynamic from "next/dynamic"
import DOMPurify from "isomorphic-dompurify"
import ButtonCancel from "@/components/ui/buttons/button-cancel"
import ButtonPrimary from "@/components/ui/buttons/button-primary"
import ButtonSecondary from "@/components/ui/buttons/button-secondary"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const QuillEditor = dynamic(() => import('@/components/quill/quillEditor'), {ssr: false})

interface BaseProps {
    initialTitle?: string;
    initialContent?: string;
    userErrors: string[];
    onCancel: () => void;
}

type NewModeProps = BaseProps & {
  mode: 'new';
  onSaveDraft: (title: string, content: string) => void;
  onPublish: (title: string, content: string) => void;
};

type EditModeProps = BaseProps & {
  mode: 'edit';
  onEditAndSaveDraft: (title: string, content: string) => void;
  onEditAndPublish: (title: string, content: string) => void;
};

type BlogFormProps = NewModeProps | EditModeProps;

export default function BlogForm(props: BlogFormProps) {
    const { mode, initialTitle = '', initialContent = '', userErrors, onCancel }  = props;

    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent);

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
            {/* Display Form Errors */}
            { userErrors?.length > 0 && (
                userErrors?.map((error, index) => (
                    <p key={index} className="block text-red-400 text-lg">{error}</p>
                ))
            )}
            {/* Buttons */}
            { mode === 'new' ? (
                <div className="flex flex-row gap-4 justify-center lg:justify-end mt-2">
                    <ButtonCancel text="Cancel" onClick={onCancel} />
                    <ButtonSecondary text="Save Draft" onClick={() => props.onSaveDraft(title, content)} />
                    <ButtonPrimary text="Publish" onClick={() => props.onPublish(title, content)} />
                </div>
                ) : (
                <div className="flex flex-row gap-4 justify-center lg:justify-end mt-2">
                    <ButtonCancel text="Cancel" onClick={onCancel} />
                    <ButtonSecondary text="Edit and Save Draft" onClick={() => props.onEditAndSaveDraft(title, content)} />
                    <ButtonPrimary text="Edit and Publish" onClick={() => props.onEditAndPublish(title, content)} />
                </div>
            )}
            {/* Preview */}
            <h2>Live Preview:</h2>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content)}} />
        </div>
    )
}
