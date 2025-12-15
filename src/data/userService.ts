export interface User {
    id: number;
    firstName: string;
    lastName: string;
    mobile: string;
    address: string;
    age: number;
    gender: string;
    education: string;
    interests: string[];
    availabilityDate: string;
}


const STORAGE_KEY = "users_db";

type NewUser = Omit<User, "id">;

const emitter = new EventTarget();

function emitChange() {
    emitter.dispatchEvent(new CustomEvent("change"));
}

export function subscribe(cb: () => void) {
    const listener = () => cb();
    emitter.addEventListener("change", listener as EventListener);
    return () => emitter.removeEventListener("change", listener as EventListener);
}

function readStorage(): User[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as User[] : [];
}

function writeStorage(users: User[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    emitChange();
}

export async function getUsers(): Promise<User[]> {
    // Keep API async to allow easy migration to a real backend
    return Promise.resolve(readStorage());
}

export async function getUser(id: number): Promise<User | undefined> {
    const users = readStorage();
    return Promise.resolve(users.find((u) => u.id === id));
}

function nextId(): number {
    // Use timestamp-based id to avoid collisions when multiple tabs
    return Date.now();
}

export async function addUser(user: NewUser): Promise<User> {
    const users = readStorage();
    const newUser: User = { ...user, id: nextId() };
    users.push(newUser);
    writeStorage(users);
    return Promise.resolve(newUser);
}

export async function updateUser(id: number, updated: Partial<User>): Promise<User | undefined> {
    const users = readStorage();
    let found: User | undefined;
    const next = users.map((u) => {
        if (u.id === id) {
            found = { ...u, ...updated };
            return found;
        }
        return u;
    });
    writeStorage(next);
    return Promise.resolve(found);
}

export async function deleteUser(id: number): Promise<boolean> {
    const users = readStorage();
    const next = users.filter((u) => u.id !== id);
    writeStorage(next);
    return Promise.resolve(users.length !== next.length);
}
