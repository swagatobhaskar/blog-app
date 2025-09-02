"use client"

import { Button } from "./button";

type ButtonSecondaryProps = {
    text: string;
    onclick?: () => void;
    icon?: React.ReactNode;
}

export default function ButtonSecondary({text, onclick, icon}: ButtonSecondaryProps) {
    return (
        <Button
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded cursor-pointer hover:bg-gray-300 mt-4"
            onClick={onclick}
        >
            {icon && <span className="icon">{icon}</span>}
            {text}
        </Button>
    );
}