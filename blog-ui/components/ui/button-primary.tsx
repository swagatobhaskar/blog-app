"use client"

type ButtonPrimaryProps = {
    text: string;
    onclick?: () => void;
    icon?: React.ReactNode;
}

export default function ButtonPrimary({text, onclick, icon}: ButtonPrimaryProps) {
    return (
        <button
            className="bg-blue-300 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-400 mt-4"
            onClick={onclick}
        >
            {icon && <span className="icon">{icon}</span>}
            {text}
        </button>
    );
}
