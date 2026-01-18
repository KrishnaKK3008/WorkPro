import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  type DroppableProvided, 
  type DraggableProvided 
} from "@hello-pangea/dnd";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, History, Layers, CheckSquare } from "lucide-react";
import { useState, useMemo } from "react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import TaskDetailSheet from "@/components/TaskDetailSheet";
import ActivityLog from "@/components/ActivityLog";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

const COLUMNS = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export default function ProjectBoard() {
  const { projectId } = useParams();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => (await api.get(`/tasks/project/${projectId}`)).data,
  });

  const { data: project } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => (await api.get(`/projects/${projectId}`)).data,
  });

  const { data: employees } = useQuery({
    queryKey: ["users"],
    queryFn: async () => (await api.get("/auth/users")).data,
    select: (data: any[]) => data.filter((u) => u.role === "employee"),
  });

  const moveMutation = useMutation({
    mutationFn: ({ taskId, status }: any) => api.patch(`/tasks/${taskId}`, { status }),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
        queryClient.invalidateQueries({ queryKey: ["activity", projectId] });
    }
  });

  const createTaskMutation = useMutation({
    mutationFn: (newTask: any) => api.post("/tasks", newTask),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
        queryClient.invalidateQueries({ queryKey: ["activity", projectId] });
        setIsTaskOpen(false);
    }
  });

  const filteredTasks = useMemo(() => {
    return tasks?.filter((task: any) => {
      const matchesSearch = task.title.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesPriority = priorityFilter === "ALL" || task.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });
  }, [tasks, debouncedSearch, priorityFilter]);

  const tasksByStatus = {
    TODO: filteredTasks?.filter((t: any) => t.status === "TODO") || [],
    IN_PROGRESS: filteredTasks?.filter((t: any) => t.status === "IN_PROGRESS") || [],
    DONE: filteredTasks?.filter((t: any) => t.status === "DONE") || [],
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    moveMutation.mutate({ taskId: result.draggableId, status: result.destination.droppableId });
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    createTaskMutation.mutate({
        title: formData.get("title"),
        description: formData.get("description"),
        priority: formData.get("priority"),
        assigneeId: formData.get("assigneeId"),
        projectId,
    });
  };

  if (tasksLoading) return <div className="p-10 text-center animate-pulse text-zinc-400 font-bold uppercase tracking-widest">Syncing Syncra Board...</div>;

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
            <div className="flex items-center gap-2 text-blue-600 mb-1">
                <Layers className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Workforce Board</span>
            </div>
            <h1 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase">{project?.name}</h1>
        </div>
        
        <div className="flex items-center gap-3">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" className="border-zinc-200 hover:bg-zinc-50 font-bold text-[10px] uppercase tracking-widest h-10 px-4 rounded-xl">
                        <History className="h-4 w-4 mr-2 text-blue-500" /> History
                    </Button>
                </SheetTrigger>
                <ActivityLog projectId={projectId!} />
            </Sheet>

            {user?.role === "admin" && (
                <Dialog open={isTaskOpen} onOpenChange={setIsTaskOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] uppercase tracking-widest h-10 px-6 rounded-xl shadow-lg shadow-blue-500/20">
                            <Plus className="mr-2 h-4 w-4" /> Add Task
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader><DialogTitle className="font-black uppercase tracking-tight">New Sprint Task</DialogTitle></DialogHeader>
                        <form onSubmit={handleCreateTask} className="space-y-4 pt-2">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Title</label>
                                <Input name="title" placeholder="What needs to be done?" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Description</label>
                                <Textarea 
                                    name="description" 
                                    placeholder="Technical details (Markdown supported)..." 
                                    className="min-h-[100px] bg-zinc-50"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Priority</label>
                                    <select name="priority" className="w-full h-11 border rounded-md text-sm px-3 bg-zinc-50">
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Assign To</label>
                                    <select name="assigneeId" className="w-full h-11 border rounded-md text-sm px-3 bg-zinc-50">
                                        <option value="">Unassigned</option>
                                        {employees?.map((emp: any) => (
                                            <option key={emp._id} value={emp._id}>{emp.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <Button type="submit" className="w-full bg-zinc-900 mt-4" disabled={createTaskMutation.isPending}>
                                {createTaskMutation.isPending ? "Syncing..." : "Create Task"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-zinc-100/50 p-2 rounded-2xl border border-zinc-200/50 backdrop-blur-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input 
            placeholder="Search by title..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-none shadow-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded-xl h-10"
          />
        </div>
        <div className="flex items-center gap-2 pr-2">
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-2">Priority:</span>
            {["ALL", "HIGH", "MEDIUM", "LOW"].map((p) => (
                <button key={p} onClick={() => setPriorityFilter(p)} className={cn(
                        "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all",
                        priorityFilter === p ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300"
                    )}>{p}</button>
            ))}
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full pb-10">
          {Object.entries(COLUMNS).map(([statusKey, statusLabel]) => (
            <Droppable key={statusKey} droppableId={statusKey}>
              {(provided: DroppableProvided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="bg-zinc-100/40 border border-zinc-200/30 rounded-3xl p-4 min-h-[600px]">
                  <div className="flex items-center justify-between mb-6 px-3">
                    <h3 className="font-black text-[10px] text-zinc-400 uppercase tracking-[0.3em]">{statusLabel}</h3>
                    <span className="bg-zinc-200 text-zinc-600 px-2 py-0.5 rounded-md text-[10px] font-bold">
                        {tasksByStatus[statusKey as keyof typeof tasksByStatus].length}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    {tasksByStatus[statusKey as keyof typeof tasksByStatus].map((task: any, index: number) => {
                      const completedItems = task.checklist?.filter((i: any) => i.isCompleted).length || 0;
                      const totalItems = task.checklist?.length || 0;
                      const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

                      return (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided: DraggableProvided) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <Sheet>
                                  <SheetTrigger asChild>
                                      <Card className="group shadow-sm hover:shadow-md transition-all border-zinc-200 cursor-pointer bg-white active:scale-[0.97] rounded-2xl">
                                          <CardContent className="p-5">
                                              <span className={cn("text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-[0.15em] mb-4 inline-block", 
                                                  task.priority === 'HIGH' ? 'bg-red-100 text-red-600' : task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
                                              )}>{task.priority}</span>
                                              
                                              <p className="font-bold text-sm text-zinc-800 mb-6 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">{task.title}</p>
                                              
                                              {totalItems > 0 && (
                                                <div className="mb-6 space-y-1.5">
                                                  <div className="flex justify-between items-center text-[9px] font-bold text-zinc-400 uppercase">
                                                    <span className="flex items-center gap-1"><CheckSquare className="h-3 w-3" /> Sub-tasks</span>
                                                    <span>{completedItems}/{totalItems}</span>
                                                  </div>
                                                  <div className="h-1 w-full bg-zinc-100 rounded-full overflow-hidden">
                                                      <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${progress}%` }} />
                                                  </div>
                                                </div>
                                              )}

                                              <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                                                  <div className="flex items-center gap-2">
                                                      <div className="h-6 w-6 rounded-full bg-zinc-900 text-white text-[9px] flex items-center justify-center font-bold ring-2 ring-zinc-50">
                                                          {task.assignee?.name?.[0] || "?"}
                                                      </div>
                                                      <div className="flex flex-col">
                                                          <span className="text-[8px] font-black uppercase text-zinc-400 leading-none">Assignee</span>
                                                          <span className="text-[10px] font-bold text-zinc-700">{task.assignee?.name || "Unassigned"}</span>
                                                      </div>
                                                  </div>
                                              </div>
                                          </CardContent>
                                      </Card>
                                  </SheetTrigger>
                                  <TaskDetailSheet task={task} />
                              </Sheet>
                            </div>
                          )}
                        </Draggable>
                      )
                    })}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}