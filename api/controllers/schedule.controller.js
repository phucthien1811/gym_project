import { scheduleService } from "../services/schedule.service.js";

export const listSchedules = async (req, res, next) => {
  try {
    const { page=1, limit=10, member_id, trainer_id, from, to, status } = req.query;
    const filters = {
      page:Number(page), limit:Number(limit),
      member_id: member_id!=null ? Number(member_id) : null,
      trainer_id: trainer_id!=null ? Number(trainer_id) : null,
      from: from || null, to: to || null, status: status || null,
    };
    const [rows, c] = await Promise.all([
      scheduleService.list(filters),
      scheduleService.count(filters),
    ]);
    res.json({ data: rows, total: Number(c?.total || 0) });
  } catch (e) { next(e); }
};

export const getSchedule = async (req, res, next) => {
  try {
    const row = await scheduleService.byId(req.params.id);
    if (!row) return res.status(404).json({ message: "Not found" });
    res.json({ data: row });
  } catch (e) { next(e); }
};

export const createSchedule = async (req, res, next) => {
  try {
    const [id] = await scheduleService.create(req.body);
    const row = await scheduleService.byId(id);
    res.status(201).json({ data: row });
  } catch (e) { next(e); }
};

export const updateSchedule = async (req, res, next) => {
  try {
    await scheduleService.update(req.params.id, req.body);
    const row = await scheduleService.byId(req.params.id);
    res.json({ data: row });
  } catch (e) { next(e); }
};

export const deleteSchedule = async (req, res, next) => {
  try {
    await scheduleService.remove(req.params.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
};
