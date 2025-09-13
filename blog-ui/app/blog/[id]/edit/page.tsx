'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react' 
import BlogForm from '@/components/blog/blog-form'
import Topic from '@/lib/types/topic';
import TopicSelection from '@/components/topic/topic-selection';
import { getBlogById, updateBlogAndPublish, updateBlogAndSaveDraft } from '@/lib/api/apiBlog';
import HandleAction from '@/lib/handleAction';
import { validateBlogInput } from '@/utils/validateFormFields';

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

    const handleEditAndSaveDraft = async (title: string, content: string) => {
        if (!validateBlogInput(title, content, setUserErrors)) return;
        
        const { data, error, success } = await HandleAction(
            () => updateBlogAndSaveDraft(id, title, content, editedTopics), // !! not taking title, content, topics
            {
                setLoading: setLoading,
                successMessage: "Blog updated and saved as draft.",
                errorMessage: "Could not edit or save as draft.. please try again!"
            }
        )
        if (success && data) {router.push(`/blog/draft/${data.id}`)}
    }

    const handleEditAndPublish = async (title: string, content: string) => {
        if (!validateBlogInput(title, content, setUserErrors)) return;

        const { data, error, success } = await HandleAction(
            () => updateBlogAndPublish(id, title, content, editedTopics),   // !! not taking title, content, topics
            {
                setLoading: setLoading,
                successMessage: "Blog published.",
                errorMessage: "Could not publish blog.. please try again!"
            }
        )
        if (success && data) {
            router.push(`/blog/${data.id}`)
        } else {
            console.error("Blog Update or publish failed:", error);
        }
    }

    const handleCancel = () => {
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
                    mode='edit'
                    initialTitle={title}
                    initialContent={content}
                    onCancel={handleCancel}
                    onEditAndPublish={handleEditAndPublish}
                    onEditAndSaveDraft={handleEditAndSaveDraft}
                    userErrors={userErrors.length > 0 ? userErrors : []}
                />
            </div>
        </div>
  );
}
