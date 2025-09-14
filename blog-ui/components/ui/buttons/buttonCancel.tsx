"use client"

import { Button } from "../button";

type ButtonCancelProps = {
    text: string;
    onClick?: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
}

export default function ButtonCancel({text, onClick, icon, disabled}: ButtonCancelProps) {
    return (
        <Button
            className="bg-red-300 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-400 mt-4"
            onClick={onClick}
            disabled={disabled}
        >
            {icon && <span className="icon">{icon}</span>}
            {text}
        </Button>
    );
}