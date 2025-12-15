import { Link } from "react-router-dom";
import useUsers from "../hooks/useUsers";
import UserTable from "../components/UserTable";
import UserFilter from "../components/filters/UserFilter";
import { useState, useMemo } from "react";
import useToggle from "../hooks/useToggle";

export default function UserList() {
    const { users, deleteUser } = useUsers();
    const [showFilters, toggleShowFilters, setShowFilters] = useToggle(false);
    const [applied, setApplied] = useState<{ query: string; education: string } | null>(null);

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this user?")) return;
        await deleteUser(id);
    };

    const applyFilters = (f: { query: string; education: string }) => {
        setApplied(f);
        setShowFilters(false);
    };

    const clearFilters = () => {
        setApplied(null);
        setShowFilters(false);
    };

    const filteredUsers = useMemo(() => {
        if (!applied) return users;
        const q = applied.query.trim().toLowerCase();
        return users.filter((u) => {
            // Education: match if user's education contains the selected value (case-insensitive)
            if (applied.education && applied.education !== "") {
                const edu = (u.education || "").toLowerCase();
                if (!edu.includes(applied.education.toLowerCase())) return false;
            }
            if (!q) return true;
            const hay = `${u.firstName} ${u.lastName} ${u.mobile} ${u.address} ${(u.interests || []).join(' ')}`.toLowerCase();
            return hay.includes(q);
        });
    }, [users, applied]);

    return (
        <div className="p-6">
            <div className="flex justify-between mb-4 relative">
                <h2 className="text-2xl font-semibold">Users</h2>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <button onClick={() => toggleShowFilters()} className="px-3 py-2 border rounded bg-white">Filter</button>
                        {showFilters && (
                            <div className="absolute right-0 mt-2 z-10">
                                <UserFilter initial={applied ?? undefined} onApply={applyFilters} onClear={clearFilters} onClose={() => setShowFilters(false)} hasData={users.length > 0} />
                            </div>
                        )}
                    </div>

                    <Link className="px-4 py-2 bg-green-600 text-white rounded" to="/users/create">+ Add User</Link>
                </div>
            </div>

            <UserTable data={filteredUsers} onDelete={handleDelete} emptyMessage={applied ? 'No users match filters.' : 'No users to show.'} />
        </div>
    );
}
