// File: api/routes/index.js 

import { Router } from "express";

import authRoutes from "./auth.js";
import memberRoutes from "./member.js";
import orderRoutes from "./order.js";
import memberProfileRoutes from "./member-profile.js";
import uploadsRoutes from "./uploads.js";
import packageRoutes from "./package.js";
import memberPackageRoutes from "./member-package.js";
import trainerRoutes from "./trainer.js";
import scheduleRoutes from "./schedule.js";

const r = Router();


r.get("/health", (req, res) => res.json({ ok: true }));
r.use("/auth", authRoutes);
r.use("/members", memberRoutes);
r.use("/orders", orderRoutes);
r.use("/member-profiles", memberProfileRoutes);
r.use("/uploads", uploadsRoutes);
r.use("/packages", packageRoutes);
r.use("/member-packages", memberPackageRoutes);
r.use("/trainers", trainerRoutes);
r.use("/schedules", scheduleRoutes);



export default r;