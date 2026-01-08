import { parsePgm } from './parser';
import type { PgmData, PngResult } from './types';

/**
 * Read PGM from Blob (browser)
 * @param blob - Blob or File containing PGM data
 * @returns Parsed PGM data
 */
export async function readPgmFromBlob(blob: Blob): Promise<PgmData> {
  const arrayBuffer = await blob.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  return parsePgm(uint8Array);
}

/**
 * Create a downloadable Blob from PNG data (browser)
 * @param pngResult - PNG result from convertToPng
 * @returns Blob containing PNG data
 */
export function createPngBlob(pngResult: PngResult): Blob {
  // Convert to regular array to avoid TypeScript buffer type issues
  return new Blob([pngResult.data.buffer.slice(0) as ArrayBuffer], { type: 'image/png' });
}

/**
 * Trigger download of PNG in browser
 * @param pngResult - PNG result from convertToPng
 * @param filename - Desired filename for download
 */
export function downloadPng(pngResult: PngResult, filename: string): void {
  const blob = createPngBlob(pngResult);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
