import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { LayoutDashboard, LogOut, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch users only if admin, and filter for employees only
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => (await api.get("/auth/users")).data,
    enabled: user?.role === "admin",
    select: (users: any[]) => users.filter((u) => u.role === "employee"),
  });

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout API failed", error);
    } finally {
      logout(); // This clears state and isAuthenticated
      navigate("/", { replace: true }); // Force move to landing
    }
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-zinc-50">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 text-white flex flex-col shadow-2xl">
        {/* Brand Logo */}
        <div className="p-8 text-2xl font-bold text-blue-500 uppercase tracking-tighter border-b border-zinc-800 flex items-center gap-2">
          <Layers className="h-6 w-6" />
          Syncra
        </div>

        <nav className="flex-1 p-6 space-y-4">
          {/* Dashboard Link */}
          <Link
            to="/dashboard"
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl transition-all",
              location.pathname === "/dashboard"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
            )}
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>

          {/* Admin-only Employee List */}
          {user?.role === "admin" && (
            <div className="mt-10">
              <p className="text-[10px] text-zinc-500 uppercase font-bold mb-4 px-2 tracking-widest">
                Active Employees
              </p>
              <div className="space-y-3">
                {users?.map((u: any) => (
                  <div
                    key={u._id}
                    className="text-sm text-zinc-400 flex items-center gap-2 px-3 py-1 hover:text-white transition-colors cursor-default"
                  >
                    <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    {u.name}
                  </div>
                ))}
                {(!users || users.length === 0) && (
                  <p className="text-xs text-zinc-600 px-3">No employees found.</p>
                )}
              </div>
            </div>
          )}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-6 border-t border-zinc-800">
          <div className="mb-4 px-2">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-[10px] text-blue-400 uppercase font-bold">{user.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors w-full px-2 py-2 text-sm font-medium"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Viewport */}
      <main className="flex-1 overflow-y-auto bg-zinc-50 p-10">
        <Outlet />
      </main>
    </div>
  );
}