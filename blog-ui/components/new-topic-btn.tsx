'use client'

import { useState } from "react"
import ButtonPrimary from "./ui/button-primary"
import { Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter, } from "./ui/dialog"

export default function NewTopicBtn() {

    const handleNewTopic = () => {
        
    }

    return (
        <div className="my-4 flex justify-end">
            <ButtonPrimary text="+ New Topic" onclick={handleNewTopic} />
        </div>
    )
}