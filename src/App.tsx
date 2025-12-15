import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import { UsersProvider } from "./context/UsersContext";
import NavBar from "./components/NavBar";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
        {/* App Shell / Layout */}
        <header className="w-full p-4 shadow bg-white">
          <NavBar />
        </header>

        <main className="flex-1 p-4">
          <UsersProvider>
            <AppRouter />
          </UsersProvider>
        </main>

        <footer className="w-full p-4 text-center text-sm text-gray-500">
          Built with React + Vite + TailwindCSS ⚡
        </footer>
      </div>
    </BrowserRouter>
  );
}
