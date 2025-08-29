'use client'

import { useState } from "react"
import dynamic from "next/dynamic";
// import EditorPage from "./components/EditorPage";

const QuillEditor = dynamic(() => import('@/components/quillEditor'), {ssr: false})

export default function Home() {
    const [content, setContent] = useState('')

    const handleChange = (html: string) => {
        setContent(html)        
    }

    return (
        <div className="max-w-[50vw] m-auto">
            <h2>Write a new blog:</h2>
            <QuillEditor onChange={handleChange} value={content} />
            <h2>Live Preview:</h2>
            <div dangerouslySetInnerHTML={{ __html: content}} />
        </div>
    )
}
