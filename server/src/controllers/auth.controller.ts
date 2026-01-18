import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Task from "../models/Task";

const cookieOptions = {
  httpOnly: true,
  secure: true,     
  sameSite: "none" as const, 
  maxAge: 24 * 60 * 60 * 1000, 
};

export const registerUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "employee",
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.cookie("jwt", token, cookieOptions);

    res.status(201).json({ user: { id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password as string);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.cookie("jwt", token, cookieOptions);

    res.json({ user: { id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(0),
  });
  
  res.status(200).json({ message: "Logged out successfully" });
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("name email role"); 
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const getWorkforceStats = async (req: Request, res: Response) => {
  try {
    const employees = await User.find({ role: "employee" }).select("name role");

    const stats = await Promise.all(
      employees.map(async (emp) => {
        const activeCount = await Task.countDocuments({
          assignee: emp._id,
          status: { $in: ["TODO", "IN_PROGRESS"] }
        });

        return {
          _id: emp._id,
          name: emp.name,
          activeTasks: activeCount
        };
      })
    );

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching workforce stats" });
  }
};