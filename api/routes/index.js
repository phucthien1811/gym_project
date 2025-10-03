// File: api/routes/index.js (ĐÃ SỬA LỖI)

import { Router } from "express";

// Giữ các import đã có
import authRoutes from "./auth.js";
import memberRoutes from "./member.js";
import orderRoutes from "./order.js";
import memberProfileRoutes from "./member-profile.js";
import uploadsRoutes from "./uploads.js";

// THÊM CÁC DÒNG IMPORT CÒN THIẾU
import packageRoutes from "./package.js";
import memberPackageRoutes from "./member-package.js";
import trainerRoutes from "./trainer.js";
import scheduleRoutes from "./schedule.js";
// import userRoutes from "./user.js";      // Giả sử file của bạn là user.js
 // Giả sử file của bạn là workout.js
;// Giả sử file của bạn là schedule.js

const r = Router();

// Các routes đã đúng
r.get("/health", (req, res) => res.json({ ok: true }));
r.use("/auth", authRoutes);
r.use("/members", memberRoutes);
r.use("/orders", orderRoutes);
r.use("/member-profiles", memberProfileRoutes);
r.use("/uploads", uploadsRoutes);

// Thêm routes mới
r.use("/packages", packageRoutes);
r.use("/member-packages", memberPackageRoutes);
r.use("/trainers", trainerRoutes);
r.use("/schedules", scheduleRoutes);

// Các routes này bây giờ sẽ hoạt động
// r.use("/users", userRoutes);



// Dòng r.use("/members", memberRoutes); thứ hai đã được xóa vì bị lặp

export default r;