import ytdl from 'ytdl-core'
import fs from 'fs-extra'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { exec } from 'child_process'
import { promisify } from 'util'
import { GifProcessor } from './ffmpeg'
import { ProcessingRequest, GifOptions } from '@/types'

const execAsync = promisify(exec)

export class VideoProcessor {
  private tempDir: string
  private gifProcessor: GifProcessor

  constructor() {
    this.tempDir = path.join(process.cwd(), 'temp')
    this.gifProcessor = new GifProcessor()
    fs.ensureDirSync(this.tempDir)
  }

  async downloadVideo(url: string): Promise<string> {
    const videoId = this.extractVideoId(url)
    if (!videoId) {
      throw new Error('Invalid YouTube URL')
    }

    const fileName = `${videoId}_${uuidv4()}.mp4`
    const filePath = path.join(this.tempDir, fileName)

    // First try ytdl-core with improved error handling
    try {
      return await this.downloadWithYtdlCore(url, filePath)
    } catch (ytdlError) {
      console.log('ytdl-core failed, attempting yt-dlp fallback:', ytdlError instanceof Error ? ytdlError.message : String(ytdlError))
      
      // Fallback to yt-dlp if available
      try {
        return await this.downloadWithYtDlp(url, filePath)
      } catch (ytdlpError) {
        console.log('yt-dlp also failed:', ytdlpError instanceof Error ? ytdlpError.message : String(ytdlpError))
        throw new Error(`Both download methods failed. ytdl-core: ${ytdlError instanceof Error ? ytdlError.message : String(ytdlError)}, yt-dlp: ${ytdlpError instanceof Error ? ytdlpError.message : String(ytdlpError)}`)
      }
    }
  }

  private async downloadWithYtdlCore(url: string, filePath: string): Promise<string> {
    const downloadOptions = [
      { quality: 'highest', filter: 'videoandaudio' },
      { quality: 'highestvideo', filter: (format: any) => format.container === 'mp4' },
      { quality: 'lowest', filter: 'videoandaudio' }
    ]

    for (let i = 0; i < downloadOptions.length; i++) {
      try {
        console.log(`ytdl-core attempt ${i + 1}:`, downloadOptions[i])
        
        return await new Promise<string>((resolve, reject) => {
          const stream = ytdl(url, downloadOptions[i] as any)
          const writeStream = fs.createWriteStream(filePath)
          let downloadStarted = false
          
          stream.on('progress', (chunkLength, downloaded, total) => {
            downloadStarted = true
            const percent = downloaded / total
            console.log(`downloading: ${(percent * 100).toFixed(0)}%`)
          })

          stream.pipe(writeStream)
          
          stream.on('error', (error) => {
            console.error(`ytdl-core attempt ${i + 1} failed:`, error.message)
            writeStream.destroy()
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
            reject(error)
          })
          
          writeStream.on('error', reject)
          writeStream.on('finish', () => {
            if (downloadStarted) {
              resolve(filePath)
            } else {
              reject(new Error('No data received'))
            }
          })

          setTimeout(() => {
            if (!downloadStarted) {
              stream.destroy()
              writeStream.destroy()
              reject(new Error('Timeout'))
            }
          }, 30000)
        })
      } catch (error) {
        if (i === downloadOptions.length - 1) throw error
        continue
      }
    }
    throw new Error('All ytdl-core attempts failed')
  }

  private async downloadWithYtDlp(url: string, filePath: string): Promise<string> {
    try {
      // Check if yt-dlp is available
      await execAsync('which yt-dlp')
    } catch {
      throw new Error('yt-dlp not available')
    }

    const command = `yt-dlp -f "best[ext=mp4]" --no-playlist -o "${filePath}" "${url}"`
    console.log('Running yt-dlp command:', command)
    
    try {
      const { stdout, stderr } = await execAsync(command)
      console.log('yt-dlp output:', stdout)
      if (stderr) console.log('yt-dlp stderr:', stderr)
      
      if (fs.existsSync(filePath)) {
        return filePath
      } else {
        throw new Error('yt-dlp completed but file not found')
      }
    } catch (error) {
      throw new Error(`yt-dlp failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async processToGif(
    request: ProcessingRequest,
    onProgress?: (stage: string, progress: number) => void
  ): Promise<{ gifPath: string; fileSize: number }> {
    let videoPath: string | null = null
    
    try {
      // Step 1: Download video
      onProgress?.('downloading', 0)
      videoPath = await this.downloadVideo(request.url)
      onProgress?.('downloading', 100)

      // Step 2: Configure GIF options
      const gifOptions: GifOptions = {
        startTime: request.startTime || 0,
        endTime: request.endTime || 10,
        quality: request.quality || 'low',
        fps: request.quality === 'high' ? 15 : 10,
        width: request.quality === 'high' ? 640 : 320,
        height: request.quality === 'high' ? 480 : 240,
        watermark: request.watermark !== false
      }

      // Step 3: Convert to GIF
      onProgress?.('converting', 0)
      const gifPath = await this.gifProcessor.createGif(
        videoPath,
        gifOptions,
        (progress) => onProgress?.('converting', progress)
      )

      // Step 4: Add watermark if needed
      let finalGifPath = gifPath
      if (gifOptions.watermark) {
        onProgress?.('watermarking', 0)
        finalGifPath = await this.gifProcessor.addWatermark(
          gifPath,
          'yt2gif.app'
        )
        await this.gifProcessor.cleanup(gifPath)
        onProgress?.('watermarking', 100)
      }

      // Step 5: Optimize
      onProgress?.('optimizing', 0)
      const optimizedPath = await this.gifProcessor.optimizeGif(finalGifPath)
      await this.gifProcessor.cleanup(finalGifPath)
      onProgress?.('optimizing', 100)

      const fileSize = await this.gifProcessor.getFileSize(optimizedPath)

      return {
        gifPath: optimizedPath,
        fileSize
      }
    } catch (error) {
      console.error('Processing error:', error)
      throw error
    } finally {
      // Cleanup downloaded video
      if (videoPath) {
        await this.gifProcessor.cleanup(videoPath)
      }
    }
  }

  private extractVideoId(url: string): string | null {
    const patterns = [
      // Regular YouTube videos
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
      // YouTube Shorts
      /youtube\.com\/shorts\/([^&\n?#]+)/,
      // Mobile YouTube
      /m\.youtube\.com\/watch\?.*v=([^&\n?#]+)/,
      /m\.youtube\.com\/shorts\/([^&\n?#]+)/,
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    
    return null
  }

  async cleanup(filePath: string): Promise<void> {
    await this.gifProcessor.cleanup(filePath)
  }
}