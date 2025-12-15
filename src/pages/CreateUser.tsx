import UserForm from "../components/forms/UserForm";

export default function CreateUser() {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Create User</h2>
            <UserForm mode="create" />
        </div>
    );
}
