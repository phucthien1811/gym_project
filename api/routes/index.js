//api/routes/index.js

import { Router } from "express";
import authRoutes from "./auth.js";
import userRoutes from "./user.js";
import workoutRoutes from "./workout.js";
import scheduleRoutes from "./schedule.js";
import memberRoutes from "./member.js";

const r = Router();

r.get("/health", (req, res) => res.json({ ok: true }));

r.use("/auth", authRoutes);
r.use("/users", userRoutes);
r.use("/workouts", workoutRoutes);
r.use("/schedules", scheduleRoutes);
r.use("/members", memberRoutes);


export default r;
