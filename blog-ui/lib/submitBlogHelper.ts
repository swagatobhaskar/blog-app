import { BLOG_API_URL } from "./constants/constants";
import Topic from "./types/topic";

const SubmitBlog = async ({
    title,
    content,
    isDraft,
    topicsToUse,
}: {
  title: string;
  content: string;
  isDraft: boolean;
  topicsToUse: Topic[];
}) => {
    if (!title.trim()) {
        alert("Title is required");
        return;
    }
    
    if (!content.trim()) {
        alert("Content is required");
        return;
    }
    
    const topicIds = topicsToUse.map(topic => topic.id);

    const newBlogBody = {
        title,
        content,
        topic_ids: topicIds,
        is_draft: isDraft,
    };
    console.log("Submitting blog:", newBlogBody)

    try {
        const resp = await fetch(BLOG_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newBlogBody),
        });

        if (resp.ok) {
            return (await resp.json())
            
        } else {
            const errorText = await resp.text();
            console.error("Failed to submit blog:", errorText);
            alert("Error: " + errorText);
        }
    } catch (error) {
        console.error("Network error:", error);
        alert("Network error. Please try again.");
    }
};

export default SubmitBlog
