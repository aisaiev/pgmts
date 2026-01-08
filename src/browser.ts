// Browser-specific entry point
// Uses pngjs/browser for PNG conversion without Node.js dependencies

export type {
  PgmData,
  PgmSignature,
  PgmInput,
  ConversionOptions,
  PngResult,
  ColorMask,
} from './types';

export { parsePgm } from './parser';
export { convertToPng } from './converter-browser';
export { toUint8Array, isNode, isBrowser } from './utils';
export { readPgmFromBlob, createPngBlob, downloadPng } from './io-browser';

// Core universal API for browser
import { parsePgm } from './parser';
import { convertToPng } from './converter-browser';
import { toUint8Array } from './utils';
import type { PgmData, PgmInput, ConversionOptions, PngResult } from './types';

/**
 * Read and parse PGM data from various input types (browser version)
 * 
 * @param input - PGM data as Uint8Array, ArrayBuffer, or Buffer
 * @returns Parsed PGM data
 */
export async function readPgm(input: Exclude<PgmInput, string>): Promise<PgmData> {
  const uint8Array = toUint8Array(input);
  return parsePgm(uint8Array);
}

/**
 * Complete workflow: Read PGM and convert to PNG (browser version)
 * 
 * @param input - PGM data as Uint8Array, ArrayBuffer, or Buffer
 * @param options - Conversion options including color masks
 * @returns PNG result with data and dimensions
 */
export async function pgmToPng(
  input: Exclude<PgmInput, string>,
  options?: ConversionOptions
): Promise<PngResult> {
  const pgmData = await readPgm(input);
  return convertToPng(pgmData, options);
}
