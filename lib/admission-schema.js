import { z } from 'zod'

export const admissionLeadSchema = z.object({
  full_name: z.string().trim().min(2, 'Full name is required.'),
  age: z
    .union([z.literal(''), z.coerce.number().int().min(4, 'Minimum age is 4.').max(80, 'Please enter a valid age.')])
    .optional()
    .transform((value) => (value === '' || value === undefined ? null : value)),
  phone_number: z.string().trim().min(10, 'Phone number is required.').max(20, 'Please enter a valid phone number.'),
  interested_course: z.string().trim().min(2, 'Please select a course.'),
  message: z
    .string()
    .trim()
    .max(600, 'Message is too long.')
    .optional()
    .transform((value) => (value ? value : null)),
})
