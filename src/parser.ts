import type { PgmData, PgmSignature } from './types';

/**
 * Check if a byte is a newline character (0x09-0x0D)
 */
function isCharNewline(char: number): boolean {
  return char >= 0x09 && char <= 0x0d;
}

/**
 * Check if a byte is whitespace (newline or space 0x20)
 */
function isCharWhitespace(char: number): boolean {
  return isCharNewline(char) || char === 0x20;
}

/**
 * Get pixel size in bytes based on maxval
 */
function getPixelSize(maxval: number): number {
  return maxval < 256 ? 1 : 2;
}

/**
 * Validate PGM signature
 */
function parseSignature(sig: string): PgmSignature {
  if (sig === 'P2' || sig === 'P5') {
    return sig;
  }
  throw new Error(`Invalid PGM signature: ${sig}`);
}

/**
 * Validate maxval range
 */
function isMaxvalValid(maxval: number): boolean {
  return maxval > 0 && maxval < 65536;
}

/**
 * Read until whitespace, handling comments
 * Returns [token, nextOffset]
 */
function readUntilWhitespace(
  data: Uint8Array,
  offset: number
): [string, number] {
  const buffer: number[] = [];
  let idx = offset;

  while (idx < data.length) {
    let byte = data[idx];

    // Handle comments
    if (byte === 0x23) { // '#' character
      // Skip until newline
      let foundNewline = false;
      while (idx < data.length) {
        idx++;
        byte = data[idx];
        if (isCharNewline(byte)) {
          foundNewline = true;
        }
        // After finding newline, skip all consecutive newlines
        if (foundNewline && !isCharNewline(byte)) {
          break;
        }
      }
      continue;
    }

    // Check for whitespace
    if (isCharWhitespace(byte)) {
      if (buffer.length > 0) {
        return [String.fromCharCode(...buffer), idx + 1];
      }
      idx++;
      continue;
    }

    buffer.push(byte);
    idx++;
  }

  // End of data
  if (buffer.length > 0) {
    return [String.fromCharCode(...buffer), idx];
  }

  throw new Error('Unexpected end of data while reading token');
}

/**
 * Read pixels from binary (P5) or ASCII (P2) format
 */
function readPixels(
  data: Uint8Array,
  offset: number,
  pixelSize: number,
  signature: PgmSignature,
  expectedCount: number
): number[] {
  const pixels: number[] = [];

  if (signature === 'P5') {
    // Binary format
    for (let i = offset; i < data.length && pixels.length < expectedCount; i += pixelSize) {
      if (pixelSize === 1) {
        pixels.push(data[i]);
      } else {
        // 2-byte pixel, big-endian
        pixels.push((data[i] << 8) | data[i + 1]);
      }
    }
  } else {
    // ASCII format (P2)
    let idx = offset;
    while (idx < data.length && pixels.length < expectedCount) {
      const [token, nextIdx] = readUntilWhitespace(data, idx);
      idx = nextIdx;
      const value = parseInt(token, 10);
      if (isNaN(value)) {
        throw new Error(`Invalid pixel value: ${token}`);
      }
      pixels.push(value);
    }
  }

  return pixels;
}

/**
 * Parse PGM image data from Uint8Array
 * This is the universal parser that works in both Node.js and browser
 */
export function parsePgm(data: Uint8Array): PgmData {
  // Read header
  const [rawSignature, sigEnd] = readUntilWhitespace(data, 0);
  const signature = parseSignature(rawSignature);

  const [widthStr, widthEnd] = readUntilWhitespace(data, sigEnd);
  const width = parseInt(widthStr, 10);
  if (isNaN(width) || width <= 0) {
    throw new Error(`Invalid width: ${widthStr}`);
  }

  const [heightStr, heightEnd] = readUntilWhitespace(data, widthEnd);
  const height = parseInt(heightStr, 10);
  if (isNaN(height) || height <= 0) {
    throw new Error(`Invalid height: ${heightStr}`);
  }

  const [maxvalStr, maxvalEnd] = readUntilWhitespace(data, heightEnd);
  const maxval = parseInt(maxvalStr, 10);
  if (!isMaxvalValid(maxval)) {
    throw new Error(`Invalid maxval: ${maxval} (must be 0 < maxval < 65536)`);
  }

  // Read pixels
  const pixelSize = getPixelSize(maxval);
  const expectedPixelCount = width * height;
  const pixels = readPixels(data, maxvalEnd, pixelSize, signature, expectedPixelCount);

  if (pixels.length !== expectedPixelCount) {
    throw new Error(
      `Pixel count mismatch: expected ${expectedPixelCount}, got ${pixels.length}`
    );
  }

  return {
    signature,
    width,
    height,
    maxval,
    pixels,
  };
}
