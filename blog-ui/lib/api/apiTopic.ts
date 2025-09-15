import Topic from "../types/topic"
import { TOPICS_API_URL } from "../constants/constants";
import { apiHandler } from "./apiFetchHandler";

export const getAllTopics = () => apiHandler<Topic[]>(`${TOPICS_API_URL}`, { method: 'GET', auth: false })

export const getTopicById = (id: string) => apiHandler<Topic>(`${TOPICS_API_URL}/${id}`, { method: 'GET', auth: false })

export const createTopic = ({name, description}: Omit<Topic, 'id'>) => apiHandler<Topic>(
    `${TOPICS_API_URL}`, {
        auth: false,
        method: "POST",
        body: JSON.stringify({name, description})
    })

export const updateTopic = (id: string, data: Partial<Topic>) => apiHandler<Topic>(
    `${TOPICS_API_URL}/${id}`, {
        auth: false,
        method: 'PATCH',
        body: JSON.stringify(data)
    })

export const deleteTopic = (id: string) =>
    apiHandler<{ success: boolean }>(
        `${TOPICS_API_URL}/${id}`, {
            auth: false,
            method: 'DELETE'
    })
