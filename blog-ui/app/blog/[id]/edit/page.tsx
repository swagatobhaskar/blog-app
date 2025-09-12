'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react' 
import BlogForm from '@/components/blog/blog-form'
import Blog from '@/lib/types/blog';
import Topic from '@/lib/types/topic';
import TopicSelection from '@/components/topic/topic-selection';
import { getBlogById, publishDraftedBlog, savePublishedBlogAsDraft } from '@/lib/api/apiBlog';
import HandleAction from '@/lib/handleAction';

export default function EditBlogPage() {
    const {id} = useParams<{id: string}>();
    const router = useRouter();
    const [ title, setTitle ] = useState<string>('');
    const [ content, setContent ] = useState<string>('');
    const [ topics, setTopics ] = useState<Topic[]>([]);
    const [ editedTopics, setEditedTopics ] = useState<Topic[]>([]);
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ error, setError ] = useState<string | null>(null);
    const [ userErrors, setUserErrors ] = useState<string[]>([]);

    useEffect(() => {
        if (!id) return;

        const fetchBlog = async () => {
            const { data, error, success } = await HandleAction(
                () => getBlogById(id),
                {
                    setLoading: setLoading,
                    errorMessage: "Failed to load the blog!"
                }
            )
            if (success && data) {
                setTitle(data.title);
                setContent(data.content);
                setTopics(data.topics);
            }
        };

        fetchBlog();
    }, [id]);

    const handleSaveDraftFromPublish = async (title: string, content: string) => {
        if (!title.trim()) {
            setUserErrors(prev => prev.includes("Title is required!") // prevents duplication
                ? prev : [...prev, "Title is required!"]
            )
            return;
        }
    
        if (!content.trim()) {
            setUserErrors(prev => prev.includes("Content is required")
                ? prev : [...prev, "Content is required!"]
            )
            return;
        }
        const { data, error, success } = await HandleAction(
            () => savePublishedBlogAsDraft(id), // !! not taking title, content, topics
            {
                setLoading: setLoading,
                successMessage: "Blog published from draft.",
                errorMessage: "Could not publish blog.. please try again!"
            }
        )
        if (success && data) {router.push(`/blog/draft/${data.id}`)}
    }

    const handlePublishFromDraft = async (title: string, content: string) => {
        if (!title.trim()) {
            setUserErrors(prev => prev.includes("Title is required!") // prevents duplication
                ? prev : [...prev, "Title is required!"]
            )
            return;
        }
    
        if (!content.trim()) {
            setUserErrors(prev => prev.includes("Content is required")
                ? prev : [...prev, "Content is required!"]
            )
            return;
        }

        const { data, error, success } = await HandleAction(
            () => publishDraftedBlog(id),   // !! not taking title, content, topics
            {
                setLoading: setLoading,
                successMessage: "Blog published.",
                errorMessage: "Could not publish blog.. please try again!"
            }
        )
        if (success && data) {
            router.push(`/blog/${data.id}`)
        } else {
            console.error("Blog creation failed:", error);
        }
    }

    const handleCancel = async () => {
        // alert("Cancel Clicked!")
        setTitle('')
        setContent('')
        router.back()
    }

    if (loading) return <p>Loading blog post...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className='flex flex-row w-[80%] mx-auto space-x-10'>
            <TopicSelection
                assignedTopics={topics}
                onChangeSelectedTopics={(updatedTopics) => setEditedTopics(updatedTopics)}
            />
            <div className='w-[80%] mx-auto'>
                <BlogForm
                    initialTitle={title}
                    initialContent={content}
                    onCancel={handleCancel}
                    onSaveDraft={handleSaveDraftFromPublish}
                    onPublish={handlePublishFromDraft}
                    userErrors={userErrors.length > 0 ? userErrors : []}
                />
            </div>
        </div>
  );
}
