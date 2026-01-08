import type { PgmInput } from './types';

/**
 * Normalize various input types to Uint8Array
 * Handles: Uint8Array, ArrayBuffer, Buffer, and checks if it's already Uint8Array
 */
export function toUint8Array(input: PgmInput): Uint8Array {
  // Already Uint8Array
  if (input instanceof Uint8Array) {
    return input;
  }

  // ArrayBuffer
  if (input instanceof ArrayBuffer) {
    return new Uint8Array(input);
  }

  // Node.js Buffer
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(input)) {
    return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
  }

  // String input (file path) - should be handled by readPgmFromFile
  throw new Error(
    'Invalid input type. Use Uint8Array, ArrayBuffer, Buffer, or use readPgmFromFile() for file paths.'
  );
}

/**
 * Check if code is running in Node.js environment
 */
export function isNode(): boolean {
  return (
    typeof process !== 'undefined' &&
    process.versions != null &&
    process.versions.node != null
  );
}

/**
 * Check if code is running in browser environment
 */
export function isBrowser(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.document !== 'undefined'
  );
}
