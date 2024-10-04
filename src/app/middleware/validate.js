// app/middleware/validate.js
import Joi from 'joi';

export const validate = (schema) => async (req) => {
  try {
    const body = await req.json();
    await schema.validateAsync(body, { abortEarly: false });
  } catch (error) {
    throw {
      name: 'ValidationError',
      errors: error.details.map((detail) => ({
        field: detail.path[0],
        message: detail.message,
      })),
    };
  }
};

// Example schema for user creation/update
export const userSchema = Joi.object({
  name: Joi.string().required().min(2).max(50),
  email: Joi.string().email().required(),
  hourlyRate: Joi.number().positive().required(),
});

// Example schema for time entry
export const timeEntrySchema = Joi.object({
  action: Joi.string().valid('clockIn', 'clockOut').required(),
});

// Example schema for report generation
export const reportSchema = Joi.object({
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
  reportTitle: Joi.string().required().min(3).max(100),
});