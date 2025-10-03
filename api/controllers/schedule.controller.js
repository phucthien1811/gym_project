import { scheduleService } from "../services/schedule.service.js";
import scheduleRepo from "../repositories/schedule.repo.js";
import knex from '../config/knex.js';

export const listSchedules = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, trainer_id, from, to, status, class_name } = req.query;
    
    const filters = {
      page: Number(page), 
      limit: Number(limit),
      trainer_id: trainer_id ? Number(trainer_id) : null,
      from: from || null, 
      to: to || null, 
      status: status || null,
      class_name: class_name || null,
      user_id: req.user?.id || null // Add user_id để check enrollment status
    };
    
    const [rows, c] = await Promise.all([
      scheduleService.list(filters),
      scheduleService.count(filters),
    ]);
    
    res.json({ 
      success: true,
      data: rows, 
      total: Number(c?.total || 0),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(Number(c?.total || 0) / Number(limit))
      }
    });
  } catch (e) { 
    next(e); 
  }
};

export const getSchedule = async (req, res, next) => {
  try {
    const schedule = await scheduleService.byId(req.params.id);
    if (!schedule) {
      return res.status(404).json({ 
        success: false, 
        message: "Lịch học không tồn tại" 
      });
    }
    
    // Lấy danh sách học viên đăng ký
    const enrollments = await scheduleRepo.getEnrollments(req.params.id);
    
    res.json({ 
      success: true,
      data: {
        ...schedule,
        enrollments
      }
    });
  } catch (e) { 
    next(e); 
  }
};

export const createSchedule = async (req, res, next) => {
  try {
    const scheduleData = {
      ...req.body,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const schedule = await scheduleRepo.create(scheduleData);
    
    res.status(201).json({ 
      success: true,
      message: "Tạo lịch học thành công",
      data: schedule 
    });
  } catch (e) { 
    next(e); 
  }
};

export const updateSchedule = async (req, res, next) => {
  try {
    const scheduleId = req.params.id;
    const updateData = {
      ...req.body,
      updated_at: new Date()
    };
    
    const schedule = await scheduleRepo.update(scheduleId, updateData);
    
    if (!schedule) {
      return res.status(404).json({ 
        success: false, 
        message: "Lịch học không tồn tại" 
      });
    }
    
    res.json({ 
      success: true,
      message: "Cập nhật lịch học thành công",
      data: schedule 
    });
  } catch (e) { 
    next(e); 
  }
};

export const deleteSchedule = async (req, res, next) => {
  try {
    const scheduleId = req.params.id;
    
    // Kiểm tra xem lịch học có tồn tại không
    const schedule = await scheduleService.byId(scheduleId);
    if (!schedule) {
      return res.status(404).json({ 
        success: false, 
        message: "Lịch học không tồn tại" 
      });
    }
    
    // Kiểm tra xem có học viên đăng ký không
    const enrollments = await scheduleRepo.getEnrollments(scheduleId);
    if (enrollments.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Không thể xóa lịch học đã có học viên đăng ký" 
      });
    }
    
    await scheduleService.remove(scheduleId);
    res.json({ 
      success: true,
      message: "Xóa lịch học thành công"
    });
  } catch (e) { 
    next(e); 
  }
};

// Thêm các function mới cho quản lý enrollment
export const enrollStudent = async (req, res, next) => {
  try {
    const { scheduleId } = req.params;
    const { userId } = req.body;
    
    // Kiểm tra lịch học có tồn tại
    const schedule = await scheduleService.byId(scheduleId);
    if (!schedule) {
      return res.status(404).json({ 
        success: false, 
        message: "Lịch học không tồn tại" 
      });
    }
    
    // Kiểm tra số lượng học viên
    if (schedule.current_participants >= schedule.max_participants) {
      return res.status(400).json({ 
        success: false, 
        message: "Lớp học đã đầy" 
      });
    }
    
    await scheduleRepo.enrollUser(scheduleId, userId);
    await scheduleRepo.updateCurrentParticipants(scheduleId);
    
    res.json({ 
      success: true,
      message: "Đăng ký học viên thành công"
    });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY' || e.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({ 
        success: false, 
        message: "Học viên đã đăng ký lớp học này" 
      });
    }
    next(e); 
  }
};

export const removeEnrollment = async (req, res, next) => {
  try {
    const { scheduleId, userId } = req.params;
    
    await scheduleRepo.removeEnrollment(scheduleId, userId);
    await scheduleRepo.updateCurrentParticipants(scheduleId);
    
    res.json({ 
      success: true,
      message: "Hủy đăng ký thành công"
    });
  } catch (e) { 
    next(e); 
  }
};

// Get user's enrollments
export const getMyEnrollments = async (req, res, next) => {
  try {
    console.log('🔄 getMyEnrollments called for user:', req.user?.id);
    
    const userId = req.user.id; // From auth middleware
    
    const enrollments = await knex('class_enrollments')
      .join('schedules', 'class_enrollments.schedule_id', 'schedules.id')
      .leftJoin('trainers', 'schedules.trainer_id', 'trainers.id')
      .select(
        'class_enrollments.id as enrollment_id',
        'schedules.id as schedule_id',
        'schedules.class_name',
        'schedules.start_time',
        'schedules.end_time',
        'schedules.class_date',
        'schedules.room',
        'schedules.location',
        'schedules.floor', // Thêm trường floor
        'trainers.name as trainer_name'
      )
      .where('class_enrollments.user_id', userId)
      .where('schedules.status', 'scheduled')
      .orderBy('schedules.class_date', 'asc')
      .orderBy('schedules.start_time', 'asc');

    console.log('📊 Found enrollments:', enrollments.length);
    console.log('📝 Enrollments data:', enrollments);

    res.json(enrollments);
  } catch (error) {
    console.error('💥 Error getting my enrollments:', error);
    res.status(500).json({ message: 'Error retrieving enrollments', error: error.message });
  }
};

// User enroll in class
export const userEnrollClass = async (req, res, next) => {
  try {
    const scheduleId = req.params.id;
    const userId = req.user.id; // From auth middleware
    
    const result = await scheduleRepo.enrollUser(scheduleId, userId);
    res.json({ message: 'Enrolled successfully', schedule: result });
  } catch (error) {
    console.error('Error enrolling user:', error);
    if (error.message.includes('not found') || error.message.includes('full') || error.message.includes('already enrolled')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error enrolling user', error: error.message });
    }
  }
};

// User unenroll from class
export const userUnenrollClass = async (req, res, next) => {
  try {
    const scheduleId = req.params.id;
    const userId = req.user.id; // From auth middleware
    
    const result = await scheduleRepo.unenrollUser(scheduleId, userId);
    res.json({ message: 'Unenrolled successfully', schedule: result });
  } catch (error) {
    console.error('Error unenrolling user:', error);
    res.status(500).json({ message: 'Error unenrolling user', error: error.message });
  }
};

export const updateEnrollmentStatus = async (req, res, next) => {
  try {
    const { enrollmentId } = req.params;
    const { status } = req.body;
    
    await scheduleRepo.updateEnrollmentStatus(enrollmentId, status);
    
    res.json({ 
      success: true,
      message: "Cập nhật trạng thái thành công"
    });
  } catch (e) { 
    next(e); 
  }
};

export const getSchedulesByWeek = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        success: false, 
        message: "Cần cung cấp startDate và endDate" 
      });
    }
    
    const schedules = await scheduleRepo.getSchedulesByDateRange(startDate, endDate);
    
    res.json({ 
      success: true,
      data: schedules 
    });
  } catch (e) { 
    next(e); 
  }
};
