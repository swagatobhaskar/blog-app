'use client'

import { useState } from "react"

import { TOPICS_API_URL } from "@/lib/constants/constants"
import ButtonPrimary from "./ui/button-primary"
import ButtonSecondary from "./ui/button-secondary"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"

export default function TopicCreateForm() {
    const [ name, setName ] = useState<string>('')
    const [ description, setDescription ] = useState<string>('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${TOPICS_API_URL}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ name, description })
            })
        } catch (error) {
            console.error("Error creating topic:", error);
        }
    }

    const handleCancel = () => {
        setName('');
        setDescription('');
        alert("Cancelled!");
    }

    return (
        <div className="w-full md:w-2/3 lg:w-1/2 mx-auto p-4 shadow-sm rounded-md">
            <form onSubmit={handleSubmit}>
                <div className="">
                    <Label className="text-md">Name:</Label>
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className=""
                        required
                    />
                </div>
                <div className="">
                    <Label className="text-md">Description:</Label>
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="(optional)"
                        className=""
                    />
                </div>
                <div className="flex flex-row gap-2 justify-center">
                    <ButtonSecondary text="Cancel" onclick={handleCancel} />
                    <ButtonPrimary text="Create Topic" />
                </div>
            </form>
        </div>
    );
}