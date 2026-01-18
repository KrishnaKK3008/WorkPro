import mongoose, { Schema, Document } from "mongoose";

interface IChecklistItem {
  text: string;
  isCompleted: boolean;
}

export interface ITask extends Document {
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  project: mongoose.Types.ObjectId;
  assignee?: mongoose.Types.ObjectId;
  checklist: IChecklistItem[]; 
}

const TaskSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["TODO", "IN_PROGRESS", "DONE"],
      default: "TODO",
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM",
    },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    checklist: [
      {
        text: { type: String, required: true },
        isCompleted: { type: Boolean, default: false }
      }
    ],
    dueDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<ITask>("Task", TaskSchema);