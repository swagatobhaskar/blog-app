'use client'

import { useState } from "react"

import { TOPICS_API_URL } from "@/lib/constants/constants"
import ButtonPrimary from "../ui/button-primary"
import ButtonSecondary from "../ui/button-secondary"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"

type Props = {
  onClose?: () => void
}

export default function TopicCreateForm({onClose}: Props) {
    const [ name, setName ] = useState<string>('')
    const [ description, setDescription ] = useState<string>('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch(`${TOPICS_API_URL}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ name, description })
            })
        } catch (error) {
            console.error("Error creating topic:", error);
        }
        // optionally close after submit
        onClose?.()
    }

    const handleCancel = () => {
        setName('');
        setDescription('');
        onClose?.() // closes the dialog
        // alert("Cancelled!");
    }

    return (
        // <div className="w-full md:w-2/3 lg:w-1/2 mx-auto p-4 shadow-sm rounded-md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="">
                    <Label className="text-md">Name:</Label>
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        // className=""
                        required
                    />
                </div>
                <div className="">
                    <Label className="text-md">Description:</Label>
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="(optional)"
                        // className=""
                    />
                </div>
                <div className="flex gap-2 justify-center">
                    <ButtonSecondary text="Cancel" onClick={handleCancel} />
                    <ButtonPrimary text="Create Topic" />
                </div>
            </form>
        // </div>
    );
}