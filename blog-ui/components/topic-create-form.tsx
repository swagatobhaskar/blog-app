'use client'

import { useState } from "react"

import { TOPICS_API_URL } from "@/lib/constants/constants"
import ButtonPrimary from "./ui/button-primary"
import ButtonSecondary from "./ui/button-secondary"

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
        alert("Cancelled!")
    }

    return (
        <div className="">
            <form onSubmit={handleSubmit}>
                <div className="">
                    <label className="">Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className=""
                        required
                    />
                </div>
                <div className="">
                    <label className="">Description:</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="(optional)"
                        className=""
                    />
                </div>
                <div className="flex flex-row gap-2">
                    <ButtonSecondary text="Cancel" onclick={handleCancel} />
                    <ButtonPrimary text="Create Topic" />
                </div>
            </form>
        </div>
    );
}