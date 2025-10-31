import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.js";
import { validate } from "../middleware/validate.js";
import { createScheduleSchema, updateScheduleSchema } from "../validations/schedule.js";
import {
  listSchedules, 
  getSchedule, 
  createSchedule, 
  updateSchedule, 
  deleteSchedule,
  enrollStudent,
  removeEnrollment,
  updateEnrollmentStatus,
  getSchedulesByWeek,
  getMyEnrollments,
  userEnrollClass,
  userUnenrollClass,
  exportEnrolledUsers,
  exportSchedules
} from "../controllers/schedule.controller.js";

const router = Router();

// Protected routes - cần đăng nhập cho tất cả
router.use(auth);

// Test endpoint
router.get('/test', (req, res) => {
  console.log('🧪 Test endpoint hit by user:', req.user?.id);
  res.json({ message: 'Schedule routes working', user: req.user?.id });
});

// User specific routes - phải đặt trước các route có params
router.get("/my-enrollments", getMyEnrollments); // User xem lịch của mình

// Export routes - phải đặt trước các route có params
router.get("/export", authorizeRoles(['admin']), exportSchedules); // Export all schedules

// Public routes - xem lịch học (nhưng vẫn cần auth để biết user nào)
router.get("/", listSchedules);
router.get("/week", getSchedulesByWeek);
router.get("/:id", getSchedule);

// Admin routes - quản lý lịch học
router.post("/", authorizeRoles(['admin']), validate(createScheduleSchema), createSchedule);
router.put("/:id", authorizeRoles(['admin']), validate(updateScheduleSchema), updateSchedule);
router.delete("/:id", authorizeRoles(['admin']), deleteSchedule);

// Enrollment management
router.post("/:id/enroll", userEnrollClass); // User đăng ký lớp học
router.post("/:id/unenroll", userUnenrollClass); // User hủy đăng ký

// Admin enrollment management
// Admin enrollment management
router.post("/:scheduleId/enroll", authorizeRoles(['admin']), enrollStudent);
router.delete("/:scheduleId/users/:userId", authorizeRoles(['admin']), removeEnrollment);
router.patch("/enrollments/:enrollmentId/status", authorizeRoles(['admin']), updateEnrollmentStatus);

// Export enrolled users to Excel
router.get("/:id/enrollments/export", authorizeRoles(['admin']), exportEnrolledUsers);

export default router;
