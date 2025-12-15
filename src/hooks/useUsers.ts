import { useContext } from "react";
import UsersContext, { type UsersContextValue } from "../context/UsersContext";

export function useUsers(): UsersContextValue {
    const ctx = useContext(UsersContext);
    if (!ctx) throw new Error("useUsers must be used within UsersProvider");
    return ctx;
}

export default useUsers;
