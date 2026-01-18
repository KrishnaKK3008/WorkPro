import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { formatDistanceToNow } from "date-fns";
import { History, User } from "lucide-react";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export default function ActivityLog({ projectId }: { projectId: string }) {
  const { data: activities } = useQuery({
    queryKey: ["activity", projectId],
    queryFn: async () => (await api.get(`/projects/${projectId}/activity`)).data,
  });

  return (
    <SheetContent className="bg-white border-l border-zinc-200 sm:max-w-md overflow-y-auto">
      <SheetHeader className="mb-8 border-b pb-4">
        <SheetTitle className="flex items-center gap-2 text-zinc-900">
            <History className="h-5 w-5 text-blue-600" /> Project History
        </SheetTitle>
      </SheetHeader>

      <div className="space-y-8 relative before:absolute before:inset-0 before:left-[11px] before:h-full before:w-px before:bg-zinc-100">
        {activities?.map((log: any) => (
          <div key={log._id} className="relative pl-8">
            <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center z-10">
                <User className="h-3 w-3 text-blue-500" />
            </div>
            <div className="flex flex-col">
                <p className="text-sm text-zinc-700">
                    <span className="font-bold text-zinc-900">{log.user?.name}</span> {log.action}
                </p>
                <p className="text-[10px] text-zinc-400 font-bold uppercase mt-1">
                    {formatDistanceToNow(new Date(log.createdAt))} ago
                </p>
            </div>
          </div>
        ))}
        {activities?.length === 0 && (
            <p className="text-zinc-400 text-center py-20 text-sm italic">No activity recorded yet.</p>
        )}
      </div>
    </SheetContent>
  );
}