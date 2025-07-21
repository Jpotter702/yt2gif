import fs from 'fs-extra'
import path from 'path'

export class FileCleanup {
  private tempDir: string
  private maxAge: number // in milliseconds

  constructor(maxAge: number = 30 * 60 * 1000) { // 30 minutes default
    this.tempDir = path.join(process.cwd(), 'temp')
    this.maxAge = maxAge
  }

  async cleanupOldFiles(): Promise<void> {
    try {
      const files = await fs.readdir(this.tempDir)
      const now = Date.now()

      for (const file of files) {
        const filePath = path.join(this.tempDir, file)
        const stats = await fs.stat(filePath)
        
        if (now - stats.mtime.getTime() > this.maxAge) {
          await fs.remove(filePath)
          console.log(`Cleaned up old file: ${file}`)
        }
      }
    } catch (error) {
      console.error('Cleanup error:', error)
    }
  }

  async scheduleCleanup(): Promise<void> {
    // Run cleanup immediately
    await this.cleanupOldFiles()
    
    // Schedule periodic cleanup every 15 minutes
    setInterval(() => {
      this.cleanupOldFiles()
    }, 15 * 60 * 1000)
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.remove(filePath)
    } catch (error) {
      console.error('Error deleting file:', error)
    }
  }

  async ensureTempDir(): Promise<void> {
    await fs.ensureDir(this.tempDir)
  }
}

// Initialize cleanup service
export const fileCleanup = new FileCleanup()

// Start cleanup service in production
if (process.env.NODE_ENV === 'production') {
  fileCleanup.scheduleCleanup()
}