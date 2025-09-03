'use client'

import {useState, useEffect} from 'react'
import Topic from '@/lib/types/topic'
import { Input } from "./ui/input"
import { TOPICS_API_URL } from '@/lib/constants/constants'

export default function CategorySelection() {

    const [ searchText, setSearchText ] = useState<string>('')
    const [ selectedTopics, setSelectedTopics ] = useState<Topic[]>([])
    const [ topicSearchResult, setTopicSearchResult ] = useState<Topic[]>([])

    useEffect(() => {
        const fetchTopics = async () => {
            try{
                const res = await fetch(`${TOPICS_API_URL}`)
                const returnedTopics: Topic[] = await res.json()
                setTopicSearchResult(returnedTopics)
            } catch (error) {
                console.error("Error fetching topics:", error)
            }
        }
        fetchTopics()
    }, [searchText])

    return (
        <div className="">
            <p>Select Categories (3 Max)</p>
            <Input
                type="text"
                placeholder="Enter Search Term"
                onChange={(e)=>setSearchText(e.target.value)}
            />
            <div className=''>
                {/* Result Topics */}
                { topicSearchResult.length > 0 && (
                    topicSearchResult.map((topic: Topic) => (
                        <div key={topic.id} className=''>{topic.name}</div>
                    ))
                ) 
                // : (
                //     <p className='font-thin italic'>No Topic Found!</p>
                // ) }
            }
            </div>
            <div className=''>
                <p>Topics:</p>
                {selectedTopics.length === 0 && <p className='font-thin italic'>None Selected</p>}
                <div className=''>
                    {/* {selectedTopics.map((topic: Topic) => (

                    ))} */}
                </div>
            </div>
        </div>
    )
}