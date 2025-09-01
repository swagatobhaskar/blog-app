import { Key } from "react"
import Topic from "./topic"

export default interface Blog {
    id: Key, //String,
    title: string,
    content: string,
    created_at: Date,
    updated_at: Date,
    is_draft: boolean,
    topics: Topic[]
}
