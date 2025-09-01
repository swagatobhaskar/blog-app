"use client"

export default function ButtonCancel({text, onclick}: {text: string, onclick?: () => void}) {
    return (
        <button
            className="bg-red-300 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-400 mt-4"
            onClick={onclick}
        >
            {text}
        </button>
    );
}