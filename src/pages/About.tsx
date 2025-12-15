export default function About() {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">About This App</h2>
            <p className="mb-4 text-gray-700">This is a small React + Vite playground demonstrating CRUD operations stored in-browser. It's intentionally minimal, focused on clean patterns, accessibility, and responsiveness.</p>

            <div className="bg-white p-6 rounded shadow">
                <h3 className="font-semibold mb-2">Features</h3>
                <ul className="list-disc pl-5 text-gray-700">
                    <li>Client-side persistence using localStorage with multi-tab updates.</li>
                    <li>Centralized state via `UsersProvider` and `useUsers()` hook.</li>
                    <li>Responsive UI and accessible forms.</li>
                    <li>Modular component structure for easy maintenance.</li>
                </ul>
            </div>
        </div>
    );
}
