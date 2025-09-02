// server component

import TopicCreateForm from "@/components/topic-create-form";
import TopicModifyButtons from "@/components/topic-modify-btns";
import { TOPICS_API_URL } from "@/lib/constants/constants";
import Topic from "@/lib/types/topic";

export default async function TopicPage() {
    const res = await fetch(`${TOPICS_API_URL}`)
    const topics: Topic[] = await res.json();

    return (
        <>
            <div className="">
                {topics.map((topic) => (
                    <div key={topic.id} className="w-40 h-40 flex flex-col gap-y-2 justify-center border border-blue-700 rounded-sm bg-blue-400">
                        <p className="text-blue-900 font-semibold text-sm text-center">{topic.name}</p>
                        <p className="text-blue-900 font-light text-xs p-2 text-center">{topic.description}</p>
                        <TopicModifyButtons />
                    </div>
                ))}
            </div>
            {/* Create */}
            <TopicCreateForm />
        </>
    );
}