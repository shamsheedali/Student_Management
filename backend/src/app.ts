import express from "express";
import cors from "cors";
import { json, urlencoded } from "body-parser";
import studentRoutes from "./routes/studentRoutes";

const app = express();

// Middleware
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// Routes
app.use("/api/students", studentRoutes);

export default app;
