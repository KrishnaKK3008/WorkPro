import { Request, Response } from "express";
import Task from "../models/Task";
import Project from "../models/Project";
import { AuthRequest } from "../middleware/authMiddleware";

import Activity from "../models/Activity";

export const createTask = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { title, description, projectId, priority, assigneeId } = req.body;
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    const task = await Task.create({
      title, description, project: projectId,
      priority: priority || "MEDIUM", status: "TODO",
      assignee: assigneeId || req.user._id,
    });

    await Activity.create({
      user: req.user._id,
      project: projectId,
      task: task._id,
      action: `created task "${title}"`
    });

    res.status(201).json(task);
  } catch (error) { res.status(500).json({ message: "Server Error" }); }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { status, priority, checklist, description, title } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body, 
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (req.user) {
      let actionText = "";

      if (status) {
        actionText = `moved "${task.title}" to ${status}`;
      } else if (priority) {
        actionText = `changed priority of "${task.title}" to ${priority}`;
      } else if (checklist) {
        // Find how many are completed for a better log message
        const done = task.checklist.filter(i => i.isCompleted).length;
        const total = task.checklist.length;
        actionText = `updated sub-tasks for "${task.title}" (${done}/${total} complete)`;
      } else if (description) {
        actionText = `updated the description of "${task.title}"`;
      }

      // Save the activity if we identified an action
      if (actionText) {
        await Activity.create({
          user: req.user._id,
          project: task.project,
          task: task._id,
          action: actionText
        });
      }
    }

    res.json(task);
  } catch (error) {
    console.error("Update Task Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
export const getProjectTasks = async (req: Request, res: Response): Promise<any> => {
  try {
    const tasks = await Task.find({ project: req.params.projectId } as any)
      .populate("assignee", "name email role") // Show who is doing the work
      .sort({ createdAt: -1 }); // Newest first

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getMyTasks = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await Task.find({ assignee: req.user?._id } as any)
      .populate({
        path: "project",
        select: "name owner",
        populate: {
          path: "owner",
          select: "name", 
        },
      });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching your tasks" });
  }
};


