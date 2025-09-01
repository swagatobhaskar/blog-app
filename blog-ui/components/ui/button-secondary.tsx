"use client"

export default function ButtonSecondary({text, onclick}: {text: string, onclick?: () => void}) {
    return (
        <button
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded cursor-pointer hover:bg-gray-300 mt-4"
            onClick={onclick}
        >
            {text}
        </button>
    );
}