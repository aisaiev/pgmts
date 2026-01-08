import { PNG } from 'pngjs';
import type { PgmData, ConversionOptions, PngResult, ColorMask } from './types';

/**
 * Convert PGM data to PNG format (Node.js version using pngjs streams)
 * @param pgmData - Parsed PGM image data
 * @param options - Conversion options including color masks
 * @returns PNG image data as Uint8Array
 */
export function convertToPng(
  pgmData: PgmData,
  options: ConversionOptions = {}
): Promise<PngResult> {
  const { colorMasks = [[1, 1, 1]] } = options;

  return new Promise((resolve, reject) => {
    try {
      const png = new PNG({
        width: pgmData.width,
        height: pgmData.height,
      });

      // Convert grayscale pixels to RGBA
      for (let y = 0; y < pgmData.height; y++) {
        for (let x = 0; x < pgmData.width; x++) {
          const idx = pgmData.width * y + x;
          const pngIdx = idx << 2; // Multiply by 4 for RGBA

          // Normalize pixel value to 0-255 range
          const normalizedPixel = (pgmData.pixels[idx] / pgmData.maxval) * 255;

          // Determine which color mask to apply based on brightness
          const colorMaskIndex = Math.floor(
            Math.min(normalizedPixel, 254) / 255 * colorMasks.length
          );
          const colorMask: ColorMask = colorMasks[colorMaskIndex];

          // Apply color mask
          const r = Math.min(normalizedPixel * colorMask[0], 255);
          const g = Math.min(normalizedPixel * colorMask[1], 255);
          const b = Math.min(normalizedPixel * colorMask[2], 255);

          png.data[pngIdx] = r;
          png.data[pngIdx + 1] = g;
          png.data[pngIdx + 2] = b;
          png.data[pngIdx + 3] = 0xff; // Alpha channel (fully opaque)
        }
      }

      // Pack PNG data
      const chunks: Buffer[] = [];
      png
        .pack()
        .on('data', (chunk: Buffer) => chunks.push(chunk))
        .on('end', () => {
          const buffer = Buffer.concat(chunks);
          resolve({
            data: new Uint8Array(buffer),
            width: pgmData.width,
            height: pgmData.height,
          });
        })
        .on('error', (err: Error) => reject(err));
    } catch (error) {
      reject(error);
    }
  });
}
