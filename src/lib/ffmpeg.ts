import fs from 'fs-extra'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { GifOptions } from '@/types'

// Lazy load fluent-ffmpeg only when needed (not during build)
let ffmpeg: any = null

const loadFFmpeg = async () => {
  if (!ffmpeg && typeof window === 'undefined') {
    try {
      // Only load in Node.js environment, not during build
      if (process.env.NODE_ENV !== undefined) {
        const fluentFFmpeg = await import('fluent-ffmpeg')
        ffmpeg = fluentFFmpeg.default
        
        // Set FFmpeg path if available
        const ffmpegPath = process.env.FFMPEG_PATH || '/usr/bin/ffmpeg'
        if (fs.existsSync(ffmpegPath)) {
          ffmpeg.setFfmpegPath(ffmpegPath)
        }
      }
    } catch (error) {
      console.warn('FFmpeg not available:', error)
      throw new Error('FFmpeg is not available in this environment')
    }
  }
  return ffmpeg
}

export class GifProcessor {
  private tempDir: string

  constructor() {
    this.tempDir = path.join(process.cwd(), 'temp')
    // Only ensure directory exists if not in build mode
    if (typeof window === 'undefined' && process.env.NODE_ENV !== undefined) {
      try {
        fs.ensureDirSync(this.tempDir)
      } catch (error) {
        console.warn('Could not create temp directory:', error)
      }
    }
  }

  async createGif(
    inputPath: string,
    options: GifOptions,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const ffmpegInstance = await loadFFmpeg()
    if (!ffmpegInstance) {
      throw new Error('FFmpeg is not available')
    }

    const outputFileName = `${uuidv4()}.gif`
    const outputPath = path.join(this.tempDir, outputFileName)

    return new Promise((resolve, reject) => {
      let command = ffmpegInstance(inputPath)
        .seekInput(options.startTime)
        .duration(options.endTime - options.startTime)
        .fps(options.fps)

      // Apply quality settings based on tier
      if (options.quality === 'high') {
        // Premium/Pro quality: Higher resolution and better compression
        command = command
          .size(`${options.width}x${options.height}`)
          .outputOptions([
            '-vf', 'scale=' + options.width + ':-1:flags=lanczos,split[s0][s1];[s0]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle',
            '-loop', '0'
          ])
      } else {
        // Free quality: Lower resolution and basic compression
        command = command
          .size('320x240')
          .outputOptions([
            '-vf', 'scale=320:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse=dither=none',
            '-loop', '0'
          ])
      }

      command
        .output(outputPath)
        .on('progress', (progress: any) => {
          const percent = Math.round((progress.percent || 0))
          onProgress?.(percent)
        })
        .on('end', () => {
          resolve(outputPath)
        })
        .on('error', (error: any) => {
          console.error('FFmpeg error:', error)
          reject(new Error(`GIF conversion failed: ${error.message}`))
        })
        .run()
    })
  }

  async addWatermark(inputPath: string, watermarkText: string): Promise<string> {
    const ffmpegInstance = await loadFFmpeg()
    if (!ffmpegInstance) {
      throw new Error('FFmpeg is not available')
    }

    const outputFileName = `${uuidv4()}_watermarked.gif`
    const outputPath = path.join(this.tempDir, outputFileName)

    return new Promise((resolve, reject) => {
      ffmpegInstance(inputPath)
        .outputOptions([
          '-vf',
          `drawtext=text='${watermarkText}':fontsize=24:fontcolor=white:x=10:y=h-th-10:enable='between(t,0,30)'`
        ])
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (error: any) => reject(error))
        .run()
    })
  }

  async optimizeGif(inputPath: string): Promise<string> {
    const ffmpegInstance = await loadFFmpeg()
    if (!ffmpegInstance) {
      throw new Error('FFmpeg is not available')
    }

    const outputFileName = `${uuidv4()}_optimized.gif`
    const outputPath = path.join(this.tempDir, outputFileName)

    return new Promise((resolve, reject) => {
      ffmpegInstance(inputPath)
        .outputOptions([
          '-vf', 'split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse',
          '-loop', '0'
        ])
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (error: any) => reject(error))
        .run()
    })
  }

  async cleanup(filePath: string): Promise<void> {
    try {
      await fs.remove(filePath)
    } catch (error) {
      console.error('Cleanup error:', error)
    }
  }

  async getFileSize(filePath: string): Promise<number> {
    const stats = await fs.stat(filePath)
    return stats.size
  }
}