'use client'

import { useEffect, useRef } from "react";

// import Quill from "quill";
import "quill/dist/quill.snow.css";

export default function QuillEditor({ value, onChange }: {
    value: string,
    onChange: (html: string) => void
}) {
    const containerRef = useRef<HTMLDivElement>(null)
    const quillRef = useRef<any>(null)

    useEffect(() => {
        async function init() {
            const Quill = (await import('quill')).default

            if (containerRef.current && !quillRef.current) {

                quillRef.current = new Quill(containerRef.current, {
                    theme: 'snow',
                    placeholder: 'Compose an Epic',
                    modules: {
                        toolbar: {
                            container: [
                                [{ header: [1, 2, 3, false] }],
                                ['bold', 'italic', 'underline', 'strike'],
                                ['blockquote', 'code-block'],
                                [{ list: 'ordered' }, {list: 'bullet'}],
                                ['link', 'image'],
                                ['clean'],
                            
                            ],
                            handlers: {
                                image: function () {
                                    selectLocalImage()
                                },
                            },
                        },
                    },
                })

                quillRef.current.root.innerHTML = value || ''

                quillRef.current.on('text-change', () => {
                    onChange(quillRef.current.root.innerHTML)
                })
            }
        }

        const selectLocalImage = () => {
            const input = document.createElement('input')
            input.setAttribute('type', 'file')
            input.setAttribute('accept', 'image/*')
            input.click()

            input.onchange = async () => {
                const file = input.files?.[0]
                if (file) {
                    const formData = new FormData()
                    formData.append('image', file)

                    const res = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData,
                    })
                    const data = await res.json()

                    const range = quillRef.current.getSelection(true)
                    quillRef.current.insertEmbed(range.index, 'image', data.url)
                }
            }
        }

        init()
    }, [])

    return (
        <div className="border border-gray-300 rounded min-h-[300px]">
            <div ref={containerRef} className="min-h-[300px]" />
        </div>
    )
}