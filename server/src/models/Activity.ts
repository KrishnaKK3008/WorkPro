import mongoose, { Schema, Document } from "mongoose";

export interface IActivity extends Document {
  user: mongoose.Types.ObjectId;
  action: string; // e.g., "created a task", "moved task to DONE"
  task?: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
}

const ActivitySchema: Schema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IActivity>("Activity", ActivitySchema);