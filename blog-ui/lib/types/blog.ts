import { Key } from "react"
import Topic from "./topic"

export default interface Blog {
    id: string, // key
    title: string,
    content: string,
    created_at: Date,
    updated_at: Date,
    is_draft: boolean,
    topics: Topic[]
}
