/**
 * PGM format signature
 */
export type PgmSignature = 'P2' | 'P5';

/**
 * RGB color mask tuple [R, G, B] with values from 0 to 1
 */
export type ColorMask = [number, number, number];

/**
 * Parsed PGM image data
 */
export interface PgmData {
  /** Format signature: P2 (ASCII) or P5 (binary) */
  signature: PgmSignature;
  /** Image width in pixels */
  width: number;
  /** Image height in pixels */
  height: number;
  /** Maximum gray value (typically 255 or 65535) */
  maxval: number;
  /** Pixel values from top-left to bottom-right, row by row */
  pixels: number[];
}

/**
 * Input types accepted by readPgm function
 */
export type PgmInput = 
  | Uint8Array 
  | ArrayBuffer 
  | Buffer 
  | string;  // File path in Node.js

/**
 * Options for PNG conversion
 */
export interface ConversionOptions {
  /** 
   * Color masks for applying filters to the image.
   * Each mask is an RGB tuple that scales the respective color channels.
   * Multiple masks create color segments based on brightness.
   * @default [[1, 1, 1]] - No color filter
   */
  colorMasks?: ColorMask[];
}

/**
 * Result of PNG conversion
 */
export interface PngResult {
  /** PNG image data as Uint8Array */
  data: Uint8Array;
  /** Image width */
  width: number;
  /** Image height */
  height: number;
}
