import { z } from 'zod'

// Define file validation schema
export const FileUploadSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size > 0, { message: "File is required" })
    .refine((file) => file.size <= 5 * 1024 * 1024, { 
      message: "File must be 5MB or smaller" 
    })
    .refine((file) => {
      const allowedTypes = ['image/jpeg', 'image/gif']
      return allowedTypes.includes(file.type)
    }, { 
      message: "Only JPEG, and GIF files are allowed" 
    })
})

// Type for form state to handle validation errors
export type FileUploadState = {
  errors?: {
    file?: string[]
  }
  message?: string | null
}