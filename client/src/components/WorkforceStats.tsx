import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Users, AlertCircle, Zap } from "lucide-react";

export default function WorkforceStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["workforce-stats"],
    queryFn: async () => (await api.get("/auth/workforce-stats")).data,
  });

  if (isLoading) return <div className="h-20 w-full bg-zinc-100 animate-pulse rounded-xl" />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats?.map((member: any) => (
        <Card key={member._id} className="border-none bg-white shadow-sm ring-1 ring-zinc-200/60 overflow-hidden group hover:ring-blue-500 transition-all">
          <CardContent className="p-5 flex items-center gap-4 relative">
            {/* Visual background indicator for high workload */}
            {member.activeTasks > 5 && (
                <div className="absolute inset-0 bg-red-500/5 pointer-events-none" />
            )}

            <div className="h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center border border-zinc-100 group-hover:border-blue-100 transition-colors">
              <Users className="h-6 w-6 text-zinc-400 group-hover:text-blue-500" />
            </div>

            <div className="flex flex-col">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">
                {member.name}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-zinc-900 tabular-nums">
                    {member.activeTasks}
                </span>
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">
                    Active Tasks
                </span>
                
                {member.activeTasks > 5 ? (
                    <span title="Critical Overload">
  <AlertCircle className="h-4 w-4 text-red-500 animate-bounce" />
</span>
                ) : member.activeTasks > 0 ? (
                    <Zap className="h-3 w-3 text-blue-400" />
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}