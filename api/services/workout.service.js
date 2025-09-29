import { workoutRepo } from "../repositories/workout.repo.js";

export const workoutService = {
  list: (filters) => workoutRepo.list(filters),
  count: (filters) => workoutRepo.count(filters),
  byId: (id) => workoutRepo.byId(id),
  create: (data) => workoutRepo.create(data),
  update: (id, data) => workoutRepo.update(id, data),
  remove: (id) => workoutRepo.remove(id),
};
