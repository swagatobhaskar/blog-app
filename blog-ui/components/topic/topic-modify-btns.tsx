'use client'

import ButtonDelete from "../ui/button-delete-icon";
import ButtonEdit from "../ui/button-edit-icon";

export default function TopicModifyButtons() {

    const handleEditTopic = async () => {}// open modal

    const handleDeleteTopic = async () => {}// open modal

    return (
        <div className="flex flex-row gap-2 justify-center">
            <ButtonEdit />
            <ButtonDelete />
        </div>
    );
}