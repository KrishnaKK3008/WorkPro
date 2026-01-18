import express = require("express");
import cors = require("cors");
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import connDB from "./config/db";
import { Request, Response } from "express";
import authRoutes from "./routes/auth.routes";
import cookieParser from "cookie-parser";
import projectRoutes from './routes/project.routes'
import taskRoutes from './routes/task.routes'
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
connDB();
app.use(cors({
  origin: process.env.FRONTEND_URL, 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use('/api/auth',authRoutes );
app.use('/api/projects',projectRoutes);
app.use('/api/tasks', taskRoutes);
app.get('/',(req: Request, res: Response)=>{
    res.send("Hello")
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`App running on ${PORT}`)
})

