import { Request, Response } from "express";
import Project from "../models/Project";
import { AuthRequest } from "../middleware/authMiddleware";
import Activity from "../models/Activity";
export const createProject = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { name, description, members } = req.body;
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    const project = await Project.create({
      name,
      description,
      owner: req.user?._id,
      members: members || [],
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
export const getMyProjects = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user?._id }, { members: req.user?._id }],
    } as any)
    .populate("owner", "name email")
    .populate("members", "name email");

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
export const getProjectById = async (req: Request, res: Response): Promise<any> => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name")
      .populate("members", "name role");

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getProjectActivity = async (req: Request, res: Response) => {
  try {
    const activities = await Activity.find({ project: req.params.id } as any)
      .populate("user", "name")
      .sort({ createdAt: -1 }) // Newest first
      .limit(30);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching activity" });
  }
};