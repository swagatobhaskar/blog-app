'use client'

import {useState, useEffect, useRef} from 'react'
import Topic from '@/lib/types/topic'
import { Input } from "../ui/input"
import { TOPICS_API_URL } from '@/lib/constants/constants'
import RemoveIcon from '../ui/remove-icon'

type TopicSelectionProps = {
    onChangeSelectedTopics: (topic: Topic[]) => void
}

export default function TopicSelection({ onChangeSelectedTopics }: TopicSelectionProps) {

    const inputRef = useRef<HTMLInputElement>(null)
    const [ searchText, setSearchText ] = useState<string>('')
    const [ selectedTopics, setSelectedTopics ] = useState<Topic[]>([])
    const [ topicSearchResult, setTopicSearchResult ] = useState<Topic[]>([])

    const handleEscKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Escape') {
            // Clear the input
            if (inputRef.current) {
                inputRef.current.value = ""
                setSearchText("")
                inputRef.current?.blur() // Unfocus the input
            }
        }
    }

    useEffect(() => {
        const fetchTopics = async () => {
            try{
                const res = await fetch(`${TOPICS_API_URL}/search/?query=${searchText}`)
                const returnedTopics: Topic[] = await res.json()
                setTopicSearchResult(returnedTopics)
            } catch (error) {
                console.error("Error fetching topics:", error)
            }
        }
        fetchTopics()
    }, [searchText])

    // Notify parent whenever the topic selection changes
    useEffect(() => {
        onChangeSelectedTopics(selectedTopics)
    }, [selectedTopics])

    return (
        <div className="">
            <p className='font-semibold p-1'>Select Categories (5 Max)</p>
            <Input
                type="text"
                placeholder="Enter Search Term"
                disabled={selectedTopics.length >= 5}
                onChange={(e)=>setSearchText(e.target.value)}
                ref={inputRef}
                onKeyDown={handleEscKeyDown}
                className={selectedTopics.length >= 5 ? 'bg-gray-100 cursor-not-allowed' : ''}
            />
            {/* Topics Search Result */}
            <div className='grid grid-cols-3 gap-x-2 gap-y-2 mt-2'>
                { topicSearchResult.length > 0 && (
                    topicSearchResult.map((topic: Topic) => (
                        <div
                            key={topic.id}
                            onClick={() => {
                                const alreadySelected = selectedTopics.find(t => t.id === topic.id);
                                if (!alreadySelected && selectedTopics.length < 5) {
                                    setSelectedTopics([...selectedTopics, topic])}}
                                }
                            className={selectedTopics.find(t => t.id === topic.id) ? 'opacity-50 pointer-events-none' : ''}
                        >
                            <div className='inline-block bg-slate-200 px-2 py-1 rounded-md
                                text-center cursor-pointer hover:bg-slate-300 text-sm'
                            >
                                {topic.name}
                            </div>
                        </div>
                    ))
                ) 
                }
            </div>
            { topicSearchResult.length === 0 && <p className='font-thin italic'>No Topics Found</p> }
            {/* Display Selected Topics */}
            <div className='mt-4'>
                <p>Chosen Topics</p>
                {selectedTopics.length === 0 && <p className='font-thin text-sm italic text-center'>None Selected</p>}
                {selectedTopics.map((topic: Topic) => (
                    <div key={topic.id} className='inline-block bg-slate-200 m-1 px-2 py-1 rounded-md text-center text-sm'>
                        <span className='flex flex-row gap-1'>
                            <p>{topic.name}</p>
                            <div
                                className='group pl-1 cursor-pointer'
                                onClick={() => setSelectedTopics(selectedTopics.filter(t => t.id !== topic.id))}
                            >
                                {/* Default icon */}
                                <span className='group-hover:hidden'>
                                    <RemoveIcon strokeWidth={1} />
                                </span>
                                {/* Bold icon on hover */}
                                <span className='hidden group-hover:inline'>
                                    <RemoveIcon strokeWidth={2} />
                                </span>
                            </div>
                        </span>
                    </div>
                ))}
                { selectedTopics.length >= 5 && <p className='font-light text-center mt-2 text-sm text-red-500 italic'>Maximum 5 Topics!</p> }
            </div>
        </div>
    )
}
