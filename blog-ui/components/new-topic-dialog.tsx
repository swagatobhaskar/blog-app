'use client'

import { useState } from "react"
import TopicCreateForm from "./topic-create-form"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "./ui/dialog"
import ButtonPrimary from "./ui/button-primary"

export default function NewTopicCreateDialog() {
    const [open, setOpen] = useState(false)
    const icon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {/* <Button variant="default">+ New Topic</Button> */}
                <ButtonPrimary
                    text="New Topic"
                    icon={icon}
                />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogTitle className="text-lg font-bold mb-2 text-center">Create New Topic</DialogTitle>
                <TopicCreateForm onClose={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    )
}
