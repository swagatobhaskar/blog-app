// server component

import TopicCreateForm from "@/components/topic-create-form";
import TopicModifyButtons from "@/components/topic-modify-btns";
import { TOPICS_API_URL } from "@/lib/constants/constants";
import Topic from "@/lib/types/topic";
import {Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card'
import NewTopicBtn from "@/components/new-topic-btn";

export default async function TopicPage() {
    const res = await fetch(`${TOPICS_API_URL}`)
    const topics: Topic[] = await res.json();

    return (
        <>
            <NewTopicBtn />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {topics.map((topic) => (
                    <Card
                        key={topic.id}
                        className="w-full h-fit max-w-[220px] mx-auto bg-gray-200 text-slate-600"
                    >
                        <CardHeader>
                            <CardTitle className="text-md text-center font-semibold">
                                {topic.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm font-light text-center">{topic.description}</p>
                        </CardContent>
                        <CardFooter className="flex justify-center">
                            <TopicModifyButtons />
                        </CardFooter>
                    </Card>
                ))}
            </div> 
        </>
    );
}