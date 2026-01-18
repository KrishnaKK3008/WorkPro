import Activity from "../models/Activity";

export const logActivity = async (userId: any, projectId: any, action: string, taskId?: any) => {
  try {
    await Activity.create({
      user: userId,
      project: projectId,
      action,
      task: taskId
    });
  } catch (err) {
    console.error("Activity Log Error:", err);
  }
};