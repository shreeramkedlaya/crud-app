import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <h1 className="text-4xl font-bold mb-4">Welcome to the CRUD App</h1>
            <p className="text-lg text-gray-600 mb-8 text-center">
                Manage users easily with Create, Edit, and Delete operations.
            </p>

            <Link
                to="/users"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg shadow"
            >
                Go to Users
            </Link>
        </div>
    );
}
