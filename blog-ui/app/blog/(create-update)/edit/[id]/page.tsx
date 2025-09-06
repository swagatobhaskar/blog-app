'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react' 
import BlogForm from '@/components/blog-form'
import { BLOG_API_URL } from '@/lib/constants/constants';
import Blog from '@/lib/types/blog';

export default function EditBlogPage() {
    const {id} = useParams<{id: string}>();
    const router = useRouter();
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchBlog = async () => {
            try {
                setLoading(true);
                // Replace with real API call
                const res = await fetch(`${BLOG_API_URL}/${id}`)
                
                if (!res.ok) {
                    throw new Error(`Failed to fetch blog post: ${res.status}`);
                }

                const blog: Blog = await res.json();

                setTitle(blog.title);
                setContent(blog.content);
            } catch (err: any) {
                console.error(err);
                setError('Failed to load blog post.');
            } finally {
                setLoading(false);
            }
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
        // alert("Cancel Clicked!")
        router.back()
    }

    if (loading) return <p>Loading blog post...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

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
