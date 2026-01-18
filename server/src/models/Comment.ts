import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  content: string;
  author: mongoose.Types.ObjectId;
  task: mongoose.Types.ObjectId;
}

const CommentSchema: Schema = new Schema(
  {
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IComment>("Comment", CommentSchema);