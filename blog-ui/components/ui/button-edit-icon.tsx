"use client"

import { Button } from "./button";

type ButtonPrimaryProps = {
    text?: string;
    onclick?: () => void;
    // icon?: React.ReactNode;
}

export default function ButtonEdit({text, onclick}: ButtonPrimaryProps) {
    return (
        <Button
            className="bg-white px-1 py-1 rounded cursor-pointer hover:bg-gray-100 mt-4"
            onClick={onclick}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon>
                    <line x1="3" y1="22" x2="21" y2="22"></line>
            </svg>
            {text && <span className="font-sans">{text}</span>}
        </Button>
    );
}
