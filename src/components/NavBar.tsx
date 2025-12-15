import { Link, useLocation } from "react-router-dom";

export default function NavBar() {
    const loc = useLocation();

    const linkClass = (path: string) =>
        `px-3 py-2 rounded ${loc.pathname === path ? "bg-gray-200" : "hover:bg-gray-100"}`;

    return (
        <nav className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center gap-4">
                <div className="text-lg font-semibold">CRUD Playground</div>
                <Link to="/" className={linkClass("/")}>Home</Link>
                <Link to="/about" className={linkClass("/about")}>About</Link>
                <Link to="/users" className={linkClass("/users")}>Users</Link>
            </div>

            <div className="text-sm text-gray-600">Demo — no backend</div>
        </nav>
    );
}
