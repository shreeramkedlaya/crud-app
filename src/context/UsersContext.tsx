import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import * as userService from "../data/userService";
import type { User } from "../data/userService";

export type UsersContextValue = {
    users: User[];
    reload: () => Promise<void>;
    addUser: (u: Omit<User, "id">) => Promise<User>;
    updateUser: (id: number, u: Partial<User>) => Promise<User | undefined>;
    deleteUser: (id: number) => Promise<boolean>;
    getUser: (id: number) => Promise<User | undefined>;
};

const UsersContext = createContext<UsersContextValue | undefined>(undefined);

export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<User[]>([]);

    const reload = useCallback(async () => {
        const data = await userService.getUsers();
        setUsers(data);
    }, []);

    useEffect(() => {
        reload();
        const unsub = userService.subscribe(() => {
            // on storage change, refresh
            reload();
        });
        return unsub;
    }, [reload]);

    const addUser = useCallback(async (u: Omit<User, "id">) => {
        const created = await userService.addUser(u);
        // Refresh from storage to avoid duplication/race with subscribe listeners
        await reload();
        return created;
    }, [reload]);

    const updateUser = useCallback(async (id: number, u: Partial<User>) => {
        const updated = await userService.updateUser(id, u);
        if (updated) await reload();
        return updated;
    }, [reload]);

    const deleteUser = useCallback(async (id: number) => {
        const ok = await userService.deleteUser(id);
        if (ok) await reload();
        return ok;
    }, [reload]);

    const getUser = useCallback(async (id: number) => {
        return userService.getUser(id);
    }, []);

    return (
        <UsersContext.Provider value={{ users, reload, addUser, updateUser, deleteUser, getUser }}>
            {children}
        </UsersContext.Provider>
    );
};

export function useUsers() {
    const ctx = useContext(UsersContext);
    if (!ctx) throw new Error("useUsers must be used within UsersProvider");
    return ctx;
}

export default UsersContext;
