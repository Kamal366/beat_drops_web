import { z } from 'zod'
import { branches, courses } from '@/lib/site-data'

const courseTitles = courses.map((course) => course.title)
const branchNames = branches.map((branch) => branch.name)

export const admissionLeadSchema = z.object({
  full_name: z.string().trim().min(2, 'Student full name is required.'),
  parent_name: z.string().trim().min(2, 'Parent name is required.'),
  age: z.coerce.number().int().min(4, 'Minimum age is 4.').max(80, 'Please enter a valid age.'),
  phone_number: z.string().trim().min(10, 'Phone number is required.').max(20, 'Please enter a valid phone number.'),
  email: z.string().trim().email('Please enter a valid email address.'),
  interested_course: z.enum(courseTitles),
  preferred_branch: z.enum(branchNames),
  preferred_class_timing: z.string().trim().min(2, 'Preferred timing is required.'),
  prior_music_experience: z.string().trim().min(2, 'Please describe prior music experience or write none.'),
  message: z.string().trim().min(2, 'Please add a short message.').max(600, 'Message is too long.'),
})
