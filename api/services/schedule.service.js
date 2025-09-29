import { scheduleRepo } from "../repositories/schedule.repo.js";

export const scheduleService = {
  list: (filters) => scheduleRepo.list(filters),
  count: (filters) => scheduleRepo.count(filters),
  byId: (id) => scheduleRepo.byId(id),
  create: (data) => scheduleRepo.create(data),
  update: (id, data) => scheduleRepo.update(id, data),
  remove: (id) => scheduleRepo.remove(id),
};
