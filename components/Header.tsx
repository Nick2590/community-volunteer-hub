import NavLinks from "./NavLink";

export default function Header() {
    return (
        <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <a href="#home" className="text-lg font-bold text-emerald-800">
                    Community Volunteer Hub
                </a>
                <NavLinks />
            </div>
        </header>
    );
}