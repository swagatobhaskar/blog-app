import Blog from "../types/blog"
import { BLOG_API_URL } from "../constants/constants";
import { apiHandler } from "./apiFetchHandler";

export const getAllBlogs = () => apiHandler<Blog[]>(`${BLOG_API_URL}`)

export const getBlogById = (id: string) => apiHandler<Blog>(`${BLOG_API_URL}/${id}`)

export const createBlog = (data: Omit<Blog, 'id'>) => apiHandler<Blog>(
    `${BLOG_API_URL}`, {
        method: "POST",
        body: JSON.stringify(data)
    })

export const updateBlog = (id: string, data: Partial<Blog>) => apiHandler<Blog>(
    `${BLOG_API_URL}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    })

export const deleteBlog = (id: string) =>
    apiHandler<{ success: boolean }>(
        `${BLOG_API_URL}/${id}`, {
            method: 'DELETE'
    })

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
