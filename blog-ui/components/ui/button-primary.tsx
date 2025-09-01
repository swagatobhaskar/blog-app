"use client"

export default function ButtonPrimary({text, onclick}: {text: string, onclick?: () => void}) {
    return (
        <button
            className="bg-blue-300 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-400 mt-4"
            onClick={onclick}
        >
            {text}
        </button>
    );
}