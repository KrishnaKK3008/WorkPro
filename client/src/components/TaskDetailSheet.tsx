import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import api from "@/lib/axios";
import { SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import TaskChecklist from "./TaskChecklist";
import { Pencil, Save, X } from "lucide-react"; // Added icons

export default function TaskDetailSheet({ task }: { task: any }) {
  const [newComment, setNewComment] = useState("");
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editedDesc, setEditedDesc] = useState(task.description || "");
  const queryClient = useQueryClient();

  // Fetch Comments
  const { data: comments } = useQuery({
    queryKey: ["comments", task._id],
    queryFn: async () => (await api.get(`/tasks/${task._id}/comments`)).data,
  });

  // Update Task Mutation (for description)
  const updateTaskMutation = useMutation({
    mutationFn: (updates: any) => api.patch(`/tasks/${task._id}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsEditingDesc(false);
    },
  });

  // Post Comment Mutation
  const commentMutation = useMutation({
    mutationFn: (content: string) => api.post("/tasks/comments", { content, taskId: task._id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", task._id] });
      setNewComment("");
    },
  });

  const handleSaveDesc = () => {
    updateTaskMutation.mutate({ description: editedDesc });
  };

  return (
    <SheetContent className="sm:max-w-[500px] overflow-y-auto bg-white border-l shadow-2xl">
      <SheetHeader className="border-b pb-6">
        <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-black uppercase tracking-widest">
                {task.status}
            </span>
        </div>
        <SheetTitle className="text-2xl font-black text-zinc-900 leading-tight uppercase tracking-tight">
          {task.title}
        </SheetTitle>
        <SheetDescription className="text-zinc-500 text-xs font-medium">
          Assigned to <span className="text-zinc-900 font-bold">{task.assignee?.name || "Unassigned"}</span>
        </SheetDescription>
      </SheetHeader>

      <div className="py-8 space-y-10">
        <section>
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Description</h4>
            {!isEditingDesc ? (
                <button 
                  onClick={() => setIsEditingDesc(true)}
                  className="text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:underline"
                >
                    <Pencil className="h-3 w-3" /> Edit
                </button>
            ) : (
                <div className="flex gap-2">
                    <button onClick={handleSaveDesc} className="text-[10px] font-bold text-green-600 flex items-center gap-1">
                        <Save className="h-3 w-3" /> Save
                    </button>
                    <button onClick={() => { setIsEditingDesc(false); setEditedDesc(task.description); }} className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                        <X className="h-3 w-3" /> Cancel
                    </button>
                </div>
            )}
          </div>

          {isEditingDesc ? (
             <Textarea 
                value={editedDesc}
                onChange={(e) => setEditedDesc(e.target.value)}
                placeholder="Enter technical details..."
                className="min-h-[150px] bg-zinc-50 border-zinc-200 rounded-xl text-sm"
             />
          ) : (
            <div className="prose prose-sm max-w-none bg-zinc-50 p-4 rounded-2xl border border-zinc-100 text-zinc-700">
                {task.description ? (
                <ReactMarkdown>{task.description}</ReactMarkdown>
                ) : (
                <p className="italic text-zinc-400">No technical description provided. Click edit to add one.</p>
                )}
            </div>
          )}
        </section>

        <section className="bg-zinc-50/50 p-6 rounded-3xl border border-zinc-100">
           <TaskChecklist task={task} />
        </section>

        <section className="space-y-6">
          <h4 className="text-[10px] font-black text-zinc-400 mb-3 uppercase tracking-[0.2em]">Collaboration</h4>
          <div className="space-y-3">
            <Textarea 
              placeholder="Write a comment (Markdown supported)..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px] focus-visible:ring-blue-500 bg-white border-zinc-200 rounded-xl"
            />
            <Button 
                onClick={() => commentMutation.mutate(newComment)}
                disabled={!newComment || commentMutation.isPending}
                className="w-full bg-zinc-900 text-white font-bold uppercase tracking-widest text-[10px] h-11"
            >
              {commentMutation.isPending ? "Syncing..." : "Post Comment"}
            </Button>
          </div>

          <div className="space-y-4 pt-4">
            {comments?.map((c: any) => (
              <div key={c._id} className="bg-white border border-zinc-100 p-4 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-zinc-900">{c.author?.name}</span>
                  <span className="text-[10px] text-zinc-400 font-medium">
                    {formatDistanceToNow(new Date(c.createdAt))} ago
                  </span>
                </div>
                <div className="prose prose-xs text-zinc-600 text-sm">
                  <ReactMarkdown>{c.content}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </SheetContent>
  );
}