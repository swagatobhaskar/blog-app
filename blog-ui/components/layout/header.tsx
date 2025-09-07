import Nav from "./nav"

export default function Header() {
    return (
        <header className="w-full h-12 sm:h-16 md:h-20 lg:h-24 border-b-1 border-gray-600
            bg-slate-300 flex flex-row items-center justify-between px-2 sm:px-4 gap-x-3"
        >
            <h2 className="font-sans font-light text-xl sm:text-2xl">Swagato's Blogs</h2>
            <Nav />
        </header>
    )
}