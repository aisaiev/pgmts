import * as fs from 'fs/promises';
import { parsePgm } from './parser';
import type { PgmData, PngResult } from './types';

/**
 * Read PGM file from file system (Node.js only)
 * @param filePath - Path to the PGM file
 * @returns Parsed PGM data
 */
export async function readPgmFromFile(filePath: string): Promise<PgmData> {
  const buffer = await fs.readFile(filePath);
  const uint8Array = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  return parsePgm(uint8Array);
}

/**
 * Save PNG data to file system (Node.js only)
 * @param pngResult - PNG result from convertToPng
 * @param filePath - Output file path
 */
export async function savePngToFile(pngResult: PngResult, filePath: string): Promise<void> {
  await fs.writeFile(filePath, pngResult.data);
}
