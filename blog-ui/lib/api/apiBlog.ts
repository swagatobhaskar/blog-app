import Blog from "../types/blog"
import { BLOG_API_URL } from "../constants/constants";
import { apiHandler } from "./apiFetchHandler";
import Topic from "../types/topic";

export const getAllBlogs = () => apiHandler<Blog[]>(`${BLOG_API_URL}`)

export const getBlogById = (id: string) => apiHandler<Blog>(`${BLOG_API_URL}/${id}`)

export const createBlogAndPublish = async (title: string, content: string, topics: Topic[]) => {
    const topic_ids: string[] = topics.map(topic => topic.id);

    const response = await apiHandler<Blog>(`${BLOG_API_URL}`, {
        method: "POST",
        body: JSON.stringify({
            "title": title,
            "content": content,
            "is_draft": false,
            "topic_ids": topic_ids
        })
    })
    return response;    // Returning the newly created blog data
}

export const createBlogAsDraft = async (title: string, content: string, topics: Topic[]) => {
    const topic_ids: string[] = topics.map(topic => topic.id);

    const response = await apiHandler<Blog>(`${BLOG_API_URL}`, {
        method: "POST",
        body: JSON.stringify({
            "title": title,
            "content": content,
            "is_draft": true,
            "topic_ids": topic_ids
        })
    })
    return response;
}

export const updateBlog = (id: string, data: Partial<Blog>) => apiHandler<Blog>(
    `${BLOG_API_URL}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    })

export const updateBlogAndSaveDraft = async (id: string, title: string, content: string, topics: Topic[]) => {
    const topic_ids: string[] = topics.map(topic => topic.id);
    
    const response = await apiHandler<Blog>(`${BLOG_API_URL}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
            "title": title,
            "content": content,
            "is_draft": true,
            "topic_ids": topic_ids
        })
    })
    return response;
}

export const updateBlogAndPublish = async (id: string, title: string, content: string, topics: Topic[]) => {
    const topic_ids: string[] = topics.map(topic => topic.id);

    const response = await apiHandler<Blog>(`${BLOG_API_URL}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
            "title": title,
            "content": content,
            "is_draft": false,
            "topic_ids": topic_ids
        })
    })
    return response;
}

export const deleteBlog = (id: string) => apiHandler<{ success: boolean }>(`${BLOG_API_URL}/${id}`, {method: 'DELETE'})

export const getAllDraftBlogs = () => apiHandler<Blog[]>(`${BLOG_API_URL}/draft`)

export const publishDraftedBlog = (id: string) => apiHandler<Blog>(
    `${BLOG_API_URL}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({"is_draft": "false"})
    })

export const savePublishedBlogAsDraft = (id: string) => apiHandler<Blog>(
    `${BLOG_API_URL}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({"is_draft": "true"})
    })
