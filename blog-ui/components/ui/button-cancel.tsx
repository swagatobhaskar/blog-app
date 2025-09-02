"use client"

type ButtonCancelProps = {
    text: string;
    onclick?: () => void;
    icon?: React.ReactNode;
}

export default function ButtonCancel({text, onclick, icon}: ButtonCancelProps) {
    return (
        <button
            className="bg-red-300 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-400 mt-4"
            onClick={onclick}
        >
            {icon && <span className="icon">{icon}</span>}
            {text}
        </button>
    );
}