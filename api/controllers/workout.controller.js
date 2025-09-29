import { workoutService } from "../services/workout.service.js";

export const listWorkouts = async (req, res, next) => {
  try {
    const { page=1, limit=10, q="", trainer_id, active } = req.query;
    const filters = {
      page:Number(page), limit:Number(limit), q,
      trainer_id: trainer_id!=null ? Number(trainer_id) : null,
      active: active!=null ? active==='true' : null,
    };
    const [rows, c] = await Promise.all([
      workoutService.list(filters),
      workoutService.count(filters),
    ]);
    res.json({ data: rows, total: Number(c?.total || 0) });
  } catch (e) { next(e); }
};

export const getWorkout = async (req, res, next) => {
  try {
    const row = await workoutService.byId(req.params.id);
    if (!row) return res.status(404).json({ message: "Not found" });
    res.json({ data: row });
  } catch (e) { next(e); }
};

export const createWorkout = async (req, res, next) => {
  try {
    const [id] = await workoutService.create(req.body);
    const row = await workoutService.byId(id);
    res.status(201).json({ data: row });
  } catch (e) { next(e); }
};

export const updateWorkout = async (req, res, next) => {
  try {
    await workoutService.update(req.params.id, req.body);
    const row = await workoutService.byId(req.params.id);
    res.json({ data: row });
  } catch (e) { next(e); }
};

export const deleteWorkout = async (req, res, next) => {
  try {
    await workoutService.remove(req.params.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
};
