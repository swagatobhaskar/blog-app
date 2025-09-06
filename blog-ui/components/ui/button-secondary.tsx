"use client"

import { Button } from "./button";

type ButtonSecondaryProps = {
    text: string;
    onClick?: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
}

export default function ButtonSecondary({text, onClick, icon, disabled}: ButtonSecondaryProps) {
    return (
        <Button
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded cursor-pointer hover:bg-gray-300 mt-4"
            onClick={onClick}
            disabled={disabled}
        >
            {icon && <span className="icon">{icon}</span>}
            {text}
        </Button>
    );
}