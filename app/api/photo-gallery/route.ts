import fs from "fs"
import path from "path"
import { NextResponse } from "next/server"
import sharp from "sharp"
import { PhotoMeta } from "app/types"

export async function GET(request: Request) {
  // Path to the photos directory inside the "public" folder
  const photosDir = path.join(process.cwd(), "public", "photo-gallery")

  // Read all file names in the directory
  const files = fs.readdirSync(photosDir)

  // Get dimensions of each image and determine orientation
  const photoDetails: Array<PhotoMeta> = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(photosDir, file)
      const metadata = await sharp(filePath).metadata()

      return {
        url: `/photo-gallery/${file}`,
        width: metadata.width,
        height: metadata.height,
        orientation:
          metadata.width == undefined || metadata.height == undefined
            ? "unknown"
            : metadata.width > metadata.height
            ? "landscape"
            : "portrait",
      }
    })
  )

  return NextResponse.json(photoDetails)
}
