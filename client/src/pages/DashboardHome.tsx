import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/axios";
import { Link } from "react-router-dom";
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  type DroppableProvided, 
  type DraggableProvided 
} from "@hello-pangea/dnd";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Briefcase, UserCheck, Layers, Search, LayoutGrid } from "lucide-react";
import { useState, useMemo } from "react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import TaskDetailSheet from "@/components/TaskDetailSheet";
import { useDebounce } from "@/hooks/useDebounce";
import WorkforceStats from "@/components/WorkforceStats"; 

const COLUMNS = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export default function DashboardHome() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => (await api.get("/projects")).data,
    enabled: user?.role === "admin",
  });

  const { data: myTasks, isLoading: tasksLoading } = useQuery({
    queryKey: ["myTasks"],
    queryFn: async () => (await api.get("/tasks/my-tasks")).data,
    enabled: user?.role === "employee",
  });

  const createProjectMutation = useMutation({
    mutationFn: (newProject: any) => api.post("/projects", newProject),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsProjectModalOpen(false);
    },
  });

  const moveTaskMutation = useMutation({
    mutationFn: ({ taskId, status }: any) => api.patch(`/tasks/${taskId}`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["myTasks"] }),
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    createProjectMutation.mutate({
      name: formData.get("name"),
      description: formData.get("description"),
    });
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    moveTaskMutation.mutate({ taskId: result.draggableId, status: result.destination.droppableId });
  };

  const filteredMyTasks = useMemo(() => {
    return myTasks?.filter((task: any) => 
      task.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      task.project?.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [myTasks, debouncedSearch]);

  if (projectsLoading || tasksLoading) {
    return <div className="p-10 text-center animate-pulse font-black uppercase tracking-widest text-zinc-400">Syncing Workspace...</div>;
  }
  
  if (user?.role === "admin") {
    return (
      <div className="space-y-12 pb-20">
        <header>
            <h1 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase">Workforce Overview</h1>
            <p className="text-sm text-zinc-500 font-medium">Real-time team capacity and allocation</p>
        </header>

        <WorkforceStats />

        <div className="pt-10 border-t border-zinc-100">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                    <LayoutGrid className="h-5 w-5 text-blue-600" />
                    <h2 className="text-xl font-bold text-zinc-900">Active Projects</h2>
                </div>

                <Dialog open={isProjectModalOpen} onOpenChange={setIsProjectModalOpen}>
                    <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 px-6 font-bold uppercase text-[10px] tracking-widest">
                        <Plus className="mr-2 h-4 w-4" /> New Project
                    </Button>
                    </DialogTrigger>
                    <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="font-black uppercase tracking-tight">Launch Project</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateProject} className="space-y-4 pt-4">
                        <div className="space-y-1">
                            <Label className="text-[10px] font-black uppercase text-zinc-400">Name</Label>
                            <Input name="name" placeholder="Project Name" required className="h-12" />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] font-black uppercase text-zinc-400">Description</Label>
                            <Textarea name="description" placeholder="Markdown supported..." required className="min-h-[120px]" />
                        </div>
                        <Button type="submit" className="w-full bg-zinc-900 h-12 font-bold uppercase tracking-widest" disabled={createProjectMutation.isPending}>
                            {createProjectMutation.isPending ? "Deploying..." : "Launch Project"}
                        </Button>
                    </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects?.map((p: any) => (
                <Link key={p._id} to={`/dashboard/project/${p._id}`}>
                <Card className="group hover:border-blue-500 transition-all cursor-pointer border-zinc-200 shadow-sm bg-white active:scale-[0.98]">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-blue-500" /> {p.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-zinc-500 line-clamp-2 mb-6 h-10">{p.description}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Managed By</span>
                            <span className="text-[11px] font-bold text-zinc-700">{p.owner?.name}</span>
                        </div>
                    </CardContent>
                </Card>
                </Link>
            ))}
            </div>
        </div>
      </div>
    );
  }

  const tasksByStatus = {
    TODO: filteredMyTasks?.filter((t: any) => t.status === "TODO") || [],
    IN_PROGRESS: filteredMyTasks?.filter((t: any) => t.status === "IN_PROGRESS") || [],
    DONE: filteredMyTasks?.filter((t: any) => t.status === "DONE") || [],
  };

  return (
    <div className="h-full flex flex-col space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 uppercase tracking-tighter">My Workspace</h1>
          <p className="text-sm text-zinc-500 font-medium italic">Active sprint focus board</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input 
            placeholder="Search tasks or projects..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-zinc-200 rounded-xl h-12 shadow-sm focus-visible:ring-blue-500"
          />
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          {Object.entries(COLUMNS).map(([statusKey, statusLabel]) => (
            <Droppable key={statusKey} droppableId={statusKey}>
              {(provided: DroppableProvided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="bg-zinc-100/60 border border-zinc-200/50 rounded-3xl p-5 min-h-[600px]">
                  <div className="flex justify-between items-center px-2 mb-6">
                    <h3 className="font-black text-[11px] text-zinc-400 uppercase tracking-[0.2em]">{statusLabel}</h3>
                    <span className="bg-zinc-200 text-zinc-600 px-2 py-0.5 rounded text-[10px] font-bold">
                        {tasksByStatus[statusKey as keyof typeof tasksByStatus].length}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {tasksByStatus[statusKey as keyof typeof tasksByStatus].map((task: any, index: number) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided: DraggableProvided) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Card className="bg-white shadow-sm border-zinc-200 hover:shadow-md transition-all group cursor-pointer active:scale-[0.97]">
                                        <CardContent className="p-5 space-y-4">
                                            <div className="flex items-center gap-2 text-[9px] font-black text-blue-600 uppercase tracking-tighter">
                                                <Layers className="h-3 w-3" /> {task.project?.name}
                                            </div>
                                            <h4 className="font-bold text-sm text-zinc-800 group-hover:text-blue-600 transition-colors line-clamp-2">{task.title}</h4>
                                            <div className="pt-3 border-t border-zinc-50 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-6 w-6 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200">
                                                        <UserCheck className="h-3.5 w-3.5 text-zinc-500" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[8px] font-black text-zinc-400 uppercase leading-none">Assigner</span>
                                                        <span className="text-[10px] font-bold text-zinc-700">{task.project?.owner?.name}</span>
                                                    </div>
                                                </div>
                                                <div className={`h-2 w-2 rounded-full ${task.priority === 'HIGH' ? 'bg-red-500' : 'bg-green-500'}`} />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </SheetTrigger>
                                <TaskDetailSheet task={task} />
                            </Sheet>
                          </div>
                        )}
                      </Draggable>
                    ))}
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