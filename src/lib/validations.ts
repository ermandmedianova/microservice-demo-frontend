import { z } from 'zod';

export const userCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
});

export const userUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters').optional(),
  email: z.string().email('Please enter a valid email address').optional(),
});

export type UserCreateForm = z.infer<typeof userCreateSchema>;
export type UserUpdateForm = z.infer<typeof userUpdateSchema>;
