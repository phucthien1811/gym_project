import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { allow } from "../middleware/role.js";
import { validate } from "../middleware/validate.js";
import { createWorkoutSchema, updateWorkoutSchema } from "../validations/workout.js";
import {
  listWorkouts, getWorkout, createWorkout, updateWorkout, deleteWorkout
} from "../controllers/workout.controller.js";

const r = Router();

r.get("/", auth, listWorkouts);
r.get("/:id", auth, getWorkout);

// tạo/sửa/xoá: cho admin hoặc trainer
r.post("/", auth, allow("admin","trainer"), validate(createWorkoutSchema), createWorkout);
r.put("/:id", auth, allow("admin","trainer"), validate(updateWorkoutSchema), updateWorkout);
r.delete("/:id", auth, allow("admin","trainer"), deleteWorkout);

export default r;
