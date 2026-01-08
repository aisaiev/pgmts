// Main entry point - exports only core universal functions
// For Node.js-specific features, import from 'pgmts/node'
// For browser-specific features, import from 'pgmts/browser'

export type {
  PgmData,
  PgmSignature,
  PgmInput,
  ConversionOptions,
  PngResult,
  ColorMask,
} from './types';

// Core universal functions
export { parsePgm } from './parser';
export { toUint8Array, isNode, isBrowser } from './utils';

// Main universal API
import { parsePgm } from './parser';
import { toUint8Array } from './utils';
import type { PgmData, PgmInput } from './types';

/**
 * Read and parse PGM data from various input types
 * 
 * Universal function that accepts:
 * - Uint8Array: Direct byte array
 * - ArrayBuffer: Raw buffer
 * - Buffer: Node.js buffer
 * 
 * For file paths, use readPgmFromFile() from 'pgmts/node'
 * For Blobs/Files in browser, use readPgmFromBlob() from 'pgmts/browser'
 * 
 * @param input - PGM data as Uint8Array, ArrayBuffer, or Buffer
 * @returns Parsed PGM data
 */
export async function readPgm(input: Exclude<PgmInput, string>): Promise<PgmData> {
  const uint8Array = toUint8Array(input);
  return parsePgm(uint8Array);
}
