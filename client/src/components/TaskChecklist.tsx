import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export default function TaskChecklist({ task }: { task: any }) {
  const [newItem, setNewItem] = useState("");
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (updatedChecklist: any[]) => 
      api.patch(`/tasks/${task._id}`, { checklist: updatedChecklist }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["myTasks"] });
    }
  });

  const addItem = () => {
    if (!newItem.trim()) return;
    const updated = [...(task.checklist || []), { text: newItem, isCompleted: false }];
    updateMutation.mutate(updated);
    setNewItem("");
  };

  const toggleItem = (index: number) => {
    const updated = [...task.checklist];
    updated[index].isCompleted = !updated[index].isCompleted;
    updateMutation.mutate(updated);
  };

  const removeItem = (index: number) => {
    const updated = task.checklist.filter((_: any, i: number) => i !== index);
    updateMutation.mutate(updated);
  };

  const completedCount = task.checklist?.filter((i: any) => i.isCompleted).length || 0;
  const totalCount = task.checklist?.length || 0;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end mb-2">
        <h4 className="text-xs font-black uppercase text-zinc-500 tracking-widest">Sub-Tasks</h4>
        <span className="text-[10px] font-bold text-blue-600">{completedCount}/{totalCount} Done</span>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-500" 
          style={{ width: `${progress}%` }} 
        />
      </div>

      <div className="space-y-2">
        {task.checklist?.map((item: any, index: number) => (
          <div key={index} className="flex items-center gap-3 group bg-zinc-50 p-2 rounded-lg border border-transparent hover:border-zinc-200 transition-all">
            <Checkbox 
              checked={item.isCompleted} 
              onCheckedChange={() => toggleItem(index)}
              className="border-zinc-300 data-[state=checked]:bg-blue-600"
            />
            <span className={`text-sm flex-1 ${item.isCompleted ? 'line-through text-zinc-400' : 'text-zinc-700'}`}>
              {item.text}
            </span>
            <button onClick={() => removeItem(index)} className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-all">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-2">
        <Input 
          placeholder="Add a step..." 
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="h-9 text-sm bg-white"
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
        />
        <Button size="sm" onClick={addItem} className="h-9 bg-zinc-900">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}