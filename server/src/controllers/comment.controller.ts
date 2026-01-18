import { Request, Response } from "express";
import Comment from "../models/Comment";
import { AuthRequest } from "../middleware/authMiddleware";

export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const { content, taskId } = req.body;
    const comment = await Comment.create({
      content,
      task: taskId,
      author: req.user?._id,
    } as any);
    
    const populatedComment = await comment.populate("author", "name");
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment" });
  }
};

export const getTaskComments = async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find({ task: req.params.taskId } as any)
      .populate("author", "name")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments" });
  }
};