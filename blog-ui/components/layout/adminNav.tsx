'use client'

import Link from "next/link"

// Only authenticated user sees this navigation buttons

export default function AdminNav() {

    return (
        // drafts, published
        <div className="text-right">
            <Link
                className="mb-4 px-5 hover:text-blue-700"
                href={'/blog/draft'}
            >
                Drafts
            </Link>
            <hr className="border-1 border-gray-300" />
        </div>
    )
}
