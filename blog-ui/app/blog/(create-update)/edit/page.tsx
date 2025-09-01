'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react' 
import BlogForm from '@/components/blog-form'
import { BLOG_API_URL } from '@/lib/constants/constants';
import Blog from '@/lib/types/blog';

export default function EditBlogPage() {
    const {id} = useParams<{id: string}>();

    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!id) return;

        const fetchBlog = async () => {
            setLoading(true);
            // Replace with real API call
            const res = await fetch(`${BLOG_API_URL}/${id}`)
            const blog: Blog = await res.json();

            setTitle(blog.title);
            setContent(blog.content);
            setLoading(false);
        };

        fetchBlog();
    }, [id]);

    const handleSaveDraft = async (title: string, content: string) => {
        alert("Draft clicked!")
    }

    const handlePublish = async (title: string, content: string) => {
        alert("Publish Clicked!")
    }

    const handleCancel = async () => {
        alert("Cancel Clicked!")
    }

    if (loading) return <p>Loading...</p>;

    return (
    <BlogForm
        initialTitle={title}
        initialContent={content}
        onCancel={handleCancel}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
    />
  );
}
