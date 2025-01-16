'use server'

import { FileUploadSchema, FileUploadState } from '../schema/file-upload-schema'

export async function uploadFile(prevState: FileUploadState, formData: FormData): Promise<FileUploadState> {
  // Validate the file using the Zod schema
  const validatedFields = FileUploadSchema.safeParse({
    file: formData.get('file')
  })
  console.log("🚀 ~ uploadFile ~ formData.get('file'):", formData.get('file'))

  // If validation fails, return errors
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'File upload failed'
    }
  }

  // If validation passes, process the file
  const file = validatedFields.data.file
  
  try {
    // Here you would typically:
    // 1. Save the file to storage
    // 2. Process the file
    // 3. Store file metadata in database
    
    return {
      message: `Successfully uploaded ${file.name}`
    }
  } catch (error) {
    console.log("🚀 ~ uploadFile ~ error:", error)
    return {
      message: 'An error occurred during file upload'
    }
  }
}