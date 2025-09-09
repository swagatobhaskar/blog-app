import Link from "next/link";

export default function Nav() {
    return (
        <nav>
            <ul className="flex flex-row justify-center items-center gap-2 sm:gap-4">
                <Link href={'/about'} className="p-2 text-white font-sans font-light bg-gray-600 hover:bg-gray-700 rounded-sm">About</Link>
                <Link href={'/about/projects'} className="p-2 text-white font-sans font-light bg-gray-600 hover:bg-gray-700 rounded-sm">Projects</Link>
                <Link href={'/about/resume'} className="p-2 text-white font-sans font-light bg-gray-600 hover:bg-gray-700 rounded-sm">Resume</Link>
            </ul>
        </nav>
    )
}
