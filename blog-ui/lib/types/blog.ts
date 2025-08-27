import { Key } from "react"
import { Topic } from "./topic"
export interface Blog {
    id: Key, //String,
    title: String,
    content: String,
    created_at: Date,
    updated_at: Date,
    is_draft: Boolean,
    topics: Topic[]
}
