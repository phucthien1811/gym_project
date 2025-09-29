import Joi from "joi";

export const createScheduleSchema = Joi.object({
  member_id: Joi.number().integer().required(),
  trainer_id: Joi.number().integer().allow(null),
  workout_id: Joi.number().integer().allow(null),
  scheduled_at: Joi.date().required(), // ISO string/Datetime
  status: Joi.string().valid('scheduled','completed','canceled').default('scheduled'),
  note: Joi.string().allow(""),
});

export const updateScheduleSchema = Joi.object({
  member_id: Joi.number().integer(),
  trainer_id: Joi.number().integer().allow(null),
  workout_id: Joi.number().integer().allow(null),
  scheduled_at: Joi.date(),
  status: Joi.string().valid('scheduled','completed','canceled'),
  note: Joi.string().allow(""),
}).min(1);