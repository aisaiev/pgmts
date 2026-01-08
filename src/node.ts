// Node.js-specific entry point
// Includes all functionality including file system operations

export type {
  PgmData,
  PgmSignature,
  PgmInput,
  ConversionOptions,
  PngResult,
  ColorMask,
} from './types';

export { parsePgm } from './parser';
export { convertToPng } from './converter-node';
export { toUint8Array, isNode, isBrowser } from './utils';
export { readPgmFromFile, savePngToFile } from './io-node';

// Main universal API
import { parsePgm } from './parser';
import { convertToPng } from './converter-node';
import { toUint8Array } from './utils';
import type { PgmData, PgmInput, ConversionOptions, PngResult } from './types';

/**
 * Read and parse PGM data from various input types
 */
export async function readPgm(input: Exclude<PgmInput, string>): Promise<PgmData> {
  const uint8Array = toUint8Array(input);
  return parsePgm(uint8Array);
}

/**
 * Complete workflow: Read PGM and convert to PNG
 */
export async function pgmToPng(
  input: Exclude<PgmInput, string>,
  options?: ConversionOptions
): Promise<PngResult> {
  const pgmData = await readPgm(input);
  return convertToPng(pgmData, options);
}
