// server component

import TopicModifyButtons from "@/components/topic/topic-modify-btns";
import { TOPICS_API_URL } from "@/lib/constants/constants";
import Topic from "@/lib/types/topic";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/ui/card'
import NewTopicCreateDialog from "@/components/topic/new-topic-dialog";

export default async function TopicPage() {
    const res = await fetch(`${TOPICS_API_URL}`)
    const topics: Topic[] = await res.json();

    return (
        <div className="mx-auto w-5/6 lg:w-4/6">
            <div className="my-4 flex justify-end">
                <NewTopicCreateDialog />
            </div>
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
                            <TopicModifyButtons topic={topic} />
                        </CardFooter>
                    </Card>
                ))}
            </div> 
        </div>
    );
}