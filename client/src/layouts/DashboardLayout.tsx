import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { LayoutDashboard, LogOut, Layers, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Fetch Projects for the sidebar (visible to both Admin & Employee)
  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => (await api.get("/projects")).data,
  });

  // 2. Fetch users only if admin, and filter for employees only
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => (await api.get("/auth/users")).data,
    enabled: user?.role === "admin",
    select: (data: any[]) => data.filter((u) => u.role === "employee"),
  });

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout API failed", error);
    } finally {
      logout();
      navigate("/", { replace: true });
    }
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-zinc-50 font-sans">
      <aside className="w-64 bg-zinc-950 text-white flex flex-col shadow-2xl z-50">
        <div className="p-8 text-2xl font-bold text-blue-500 uppercase tracking-tighter border-b border-zinc-900 flex items-center gap-2">
          <Layers className="h-6 w-6" />
          Syncra
        </div>

        <nav className="flex-1 p-6 space-y-8 overflow-y-auto custom-scrollbar">
          {/* Main Navigation */}
          <div className="space-y-2">
            <p className="text-[10px] text-zinc-500 uppercase font-black px-2 tracking-widest">Main</p>
            <Link
                to="/dashboard"
                className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-all text-sm font-bold",
                location.pathname === "/dashboard"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                )}
            >
                <LayoutDashboard className="h-4 w-4" />
                Workspace
            </Link>
          </div>

          {/* Dynamic Projects List */}
          <div className="space-y-2">
            <p className="text-[10px] text-zinc-500 uppercase font-black px-2 tracking-widest">Active Boards</p>
            <div className="space-y-1">
                {projects?.map((p: any) => (
                    <Link
                        key={p._id}
                        to={`/dashboard/project/${p._id}`}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all",
                            location.pathname.includes(p._id) 
                                ? "text-blue-400 bg-blue-500/5" 
                                : "text-zinc-500 hover:text-zinc-300"
                        )}
                    >
                        <Briefcase className="h-3.5 w-3.5" />
                        <span className="truncate">{p.name}</span>
                    </Link>
                ))}
            </div>
          </div>

          {/* Admin-only Employee List */}
          {user?.role === "admin" && (
            <div className="space-y-2">
              <p className="text-[10px] text-zinc-500 uppercase font-black px-2 tracking-widest">Team Capacity</p>
              <div className="space-y-2 pt-2">
                {users?.map((u: any) => (
                  <div key={u._id} className="text-[11px] text-zinc-400 flex items-center gap-2 px-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {u.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </nav>

        <div className="p-6 border-t border-zinc-900 bg-zinc-950/50 backdrop-blur-md">
          <div className="mb-4 px-2">
            <p className="text-sm font-bold truncate text-white">{user.name}</p>
            <p className="text-[10px] text-blue-500 uppercase font-black tracking-tighter">{user.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors w-full px-2 py-2 text-xs font-black uppercase tracking-widest"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-zinc-50">
        <div className="p-10 max-w-7xl mx-auto">
            <Outlet />
        </div>
      </main>
    </div>
  );
}