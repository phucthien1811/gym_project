import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { allow } from "../middleware/role.js";
import { validate } from "../middleware/validate.js";
import { createScheduleSchema, updateScheduleSchema } from "../validations/schedule.js";
import {
  listSchedules, getSchedule, createSchedule, updateSchedule, deleteSchedule
} from "../controllers/schedule.controller.js";

const r = Router();

// xem danh sách lịch: ai đăng nhập cũng có thể xem (tuỳ bạn, có thể hạn chế)
r.get("/", auth, listSchedules);
r.get("/:id", auth, getSchedule);

// tạo/sửa/xoá lịch: cho admin hoặc trainer
r.post("/", auth, allow("admin","trainer"), validate(createScheduleSchema), createSchedule);
r.put("/:id", auth, allow("admin","trainer"), validate(updateScheduleSchema), updateSchedule);
r.delete("/:id", auth, allow("admin","trainer"), deleteSchedule);

export default r;
