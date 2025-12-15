import { Routes, Route } from "react-router-dom";
import UserList from "../pages/UserList";
import CreateUser from "../pages/CreateUser";
import UserForm from "../components/forms/UserForm";
import Home from "../Home";
import About from "../pages/About";

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/users/create" element={<CreateUser />} />
            <Route path="/users/:id/edit" element={<UserForm mode="edit" />} />
            <Route path="/about" element={<About />} />
        </Routes>
    );
}
