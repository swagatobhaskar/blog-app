'use client'

import { useState } from "react";
import ButtonDelete from "../ui/button-delete-icon";
import ButtonEdit from "../ui/button-edit-icon";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
    DialogTrigger
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Topic from "@/lib/types/topic";

export default function TopicModifyButtons({topic}: {topic: Topic}) {
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [topicName, setTopicName] = useState(topic.name);
    const [topicDescription, setTopicDescription] = useState(topic.description);
    
    const handleEditTopicModal = () => {
        console.log("Saving topic:", topicName);
        setEditOpen(true);
    }

    const handleDeleteTopicModal = () => {
        console.log("Deleting topic...");
        setDeleteOpen(true);
    }

    const handleSaveTopicEdit = async () => {
        alert("In savehandler")
    }

    const handleTopicDelete = async () => {
        alert("In DeleteHandler")
    }

    return (
        <div className="flex flex-row gap-2 justify-center">
            <ButtonEdit onClick={handleEditTopicModal} />
            {/* Trigger Edit Modal */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Topic</DialogTitle>
                        <DialogDescription>Modify the topic name below.</DialogDescription>
                    </DialogHeader>
                    <Input
                        value={topicName}
                        onChange={(e) => setTopicName(e.target.value)}
                        placeholder="Enter topic name"
                    />
                    <Input
                        value={topicDescription}
                        onChange={(e) => setTopicDescription(e.target.value)}
                        placeholder="Enter topic description"
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveTopicEdit}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* Trigger Delete Confirmation Modal */}
            <ButtonDelete onClick={handleDeleteTopicModal} />
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Topic?</DialogTitle>
                        <DialogDescription>This action cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleTopicDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
