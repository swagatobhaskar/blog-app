import Topic from "../types/topic"
import { TOPICS_API_URL } from "../constants/constants";
import { apiHandler } from "./apiFetchHandler";

export const getAllTopics = () => apiHandler<Topic[]>(`${TOPICS_API_URL}`)

export const getTopicById = (id: string) => apiHandler<Topic>(`${TOPICS_API_URL}/${id}`)

export const createTopic = ({name, description}: Omit<Topic, 'id'>) => apiHandler<Topic>(
    `${TOPICS_API_URL}`, {
        method: "POST",
        body: JSON.stringify({name, description})
    }
)

export const UpdateTopic = (id: string, data: Partial<Topic>) => apiHandler<Topic>(
    `${TOPICS_API_URL}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    }
)

export const DeleteTopic = (id: string) =>
    apiHandler<{ success: boolean }>(
        `${TOPICS_API_URL}/${id}`, {
            method: 'DELETE'
    })
