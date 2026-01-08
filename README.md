# pgmts

A modern TypeScript library for reading PGM (Portable GrayMap) images and converting them to PNG. Works seamlessly in both Node.js and browsers with full type safety.

## Features

✨ **Universal Input Support** - Accept `Uint8Array`, `ArrayBuffer`, `Buffer`, file paths (Node.js), or `Blob`/`File` (browser)

🌐 **Dual Environment** - Works in Node.js and browsers without modifications

📘 **TypeScript First** - Full type safety with comprehensive TypeScript definitions

🎨 **Color Filters** - Apply Instagram-style color masks to your grayscale images

⚡ **Zero Native Dependencies** - Pure TypeScript/JavaScript implementation

🔧 **Format Support** - Handles both ASCII (P2) and binary (P5) PGM formats

## Installation

```bash
npm install pgmts
```

## Import Options

The library provides three entry points for optimal tree-shaking:

```typescript
// Core universal functions (parser only, no I/O, no PNG conversion)
import { readPgm, parsePgm } from 'pgmts';

// Node.js with full functionality (includes PNG conversion via pngjs)
import { readPgmFromFile, convertToPng, savePngToFile, pgmToPng } from 'pgmts/node';

// Browser-specific functions (includes PNG conversion via pngjs/browser)
import { readPgmFromBlob, convertToPng, downloadPng, pgmToPng } from 'pgmts/browser';
```

## Quick Start

### Node.js

```typescript
import { readPgmFromFile, convertToPng, savePngToFile } from 'pgmts/node';

// Read PGM and convert to PNG
const pgmData = await readPgmFromFile('image.pgm');
const pngResult = await convertToPng(pgmData);
await savePngToFile(pngResult, 'output.png');

// With color filter
const pngWithFilter = await convertToPng(pgmData, {
  colorMasks: [[1, 0, 1]] // Purple tint
});
await savePngToFile(pngWithFilter, 'output-purple.png');
```

### Browser

```typescript
import { readPgmFromBlob, convertToPng, downloadPng } from 'pgmts/browser';

// From file input
const fileInput = document.querySelector('input[type="file"]');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const pgmData = await readPgmFromBlob(file);
  
  // Convert to PNG using pngjs/browser (no Node.js dependencies)
  const pngResult = await convertToPng(pgmData, {
    colorMasks: [[1, 0, 1]] // Optional: purple tint
  });
  
  // Trigger download
  downloadPng(pngResult, 'converted.png');
});
```

### Universal Usage (Parsing Only)

```typescript
import { readPgm, parsePgm } from 'pgmts';

// From Uint8Array (works in both Node.js and browser)
const uint8Array = new Uint8Array(pgmFileData);
const pgmData = await readPgm(uint8Array);

// From Buffer (Node.js)
const buffer = await fs.readFile('image.pgm');
const pgmData = await readPgm(buffer);

// From ArrayBuffer (browser)
const arrayBuffer = await fetch('image.pgm').then(r => r.arrayBuffer());
const pgmData = await readPgm(arrayBuffer);

// Direct parsing from Uint8Array
const pgmData = parsePgm(uint8Array);
```

**Note:** Core entry point (`pgmts`) provides parsing only. For PNG conversion:
- In **Node.js**: use `pgmts/node` (uses pngjs with Node.js streams)
- In **Browser**: use `pgmts/browser` (uses pngjs/browser, no Node.js dependencies)

## API Reference

### Core Functions (pgmts)

#### `readPgm(input: Uint8Array | ArrayBuffer | Buffer): Promise<PgmData>`

Universal function to parse PGM data from byte arrays. Works in both Node.js and browsers.

#### `parsePgm(data: Uint8Array): PgmData`

Synchronous parsing of PGM data from Uint8Array.

### Node.js Functions (pgmts/node)

#### `readPgmFromFile(filePath: string): Promise<PgmData>`

Read PGM file from the file system.

#### `convertToPng(pgmData: PgmData, options?: ConversionOptions): Promise<PngResult>`

Convert parsed PGM data to PNG format using Node.js streams.

**Options:**
- `colorMasks?: ColorMask[]` - Array of RGB color masks (default: `[[1, 1, 1]]`)

#### `savePngToFile(pngResult: PngResult, filePath: string): Promise<void>`

Save PNG data to the file system.

#### `pgmToPng(input: Uint8Array | ArrayBuffer | Buffer, options?: ConversionOptions): Promise<PngResult>`

Convenience function that combines reading and conversion in one step.

### Browser Functions (pgmts/browser)

#### `readPgmFromBlob(blob: Blob): Promise<PgmData>`

Read PGM data from a Blob or File object.

#### `convertToPng(pgmData: PgmData, options?: ConversionOptions): Promise<PngResult>`

Convert parsed PGM data to PNG format using pngjs/browser (no Node.js dependencies).

**Options:**
- `colorMasks?: ColorMask[]` - Array of RGB color masks (default: `[[1, 1, 1]]`)

#### `createPngBlob(pngResult: PngResult): Blob`

Create a Blob from PNG data.

#### `downloadPng(pngResult: PngResult, filename: string): void`

Trigger a download of the PNG file in the browser.

#### `pgmToPng(input: Uint8Array | ArrayBuffer | Buffer, options?: ConversionOptions): Promise<PngResult>`

Convenience function that combines reading and conversion in one step.

## Types

```typescript
interface PgmData {
  signature: 'P2' | 'P5';
  width: number;
  height: number;
  maxval: number;
  pixels: number[];
}

interface PngResult {
  data: Uint8Array;
  width: number;
  height: number;
}

type ColorMask = [number, number, number]; // RGB values 0-1

interface ConversionOptions {
  colorMasks?: ColorMask[];
}
```

## Color Masks

Color masks allow you to apply filters to your images. Each mask is an RGB tuple with values from 0 to 1:

```typescript
// Single color mask (purple tint)
colorMasks: [[1, 0, 1]]

// Multiple masks create color gradients based on brightness
colorMasks: [
  [0, 0, 1],    // Dark areas → blue
  [1, 0, 1],    // Medium → purple
  [1, 0, 0],    // Bright → red
  [1, 1, 0]     // Brightest → yellow
]
```

The image brightness values are segmented into buckets (one per mask), and each bucket is tinted with its respective color.

### Example Color Filters

```typescript
// Grayscale (default)
[[1, 1, 1]]

// Red channel only
[[1, 0, 0]]

// Blue-purple-red-yellow gradient (nice!)
[[0, 0, 1], [1, 0, 1], [1, 0, 0], [1, 1, 0]]

// Vintage warm tones
[[0.5, 0, 0.5], [0.7, 0, 0.7], [1, 0, 1], [1, 0.5, 0], [1, 0, 0]]
```

## Comparison with pgmjs

This library improves upon the original [pgmjs](https://www.npmjs.com/package/pgmjs):

| Feature | pgmjs | pgmts |
|---------|-------|-------|
| Environment | Node.js only | Node.js + Browser |
| Language | JavaScript | TypeScript |
| Input Types | File paths only | Multiple (Uint8Array, Buffer, Blob, etc.) |
| Type Safety | No types | Full TypeScript types |
| Bundle Size | N/A | Tree-shakeable |
| Testing | Basic | Comprehensive |

## Use Cases

- **Game Boy Camera Images** - Convert PGM images from Game Boy Camera
- **Scientific Imaging** - Process grayscale scientific data
- **Image Processing Pipelines** - Universal image format conversion
- **Web Applications** - Client-side image conversion without server uploads
- **Batch Processing** - Convert multiple PGM files with custom filters

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test
```

## License

MIT

## Credits

Inspired by [pgmjs](https://www.npmjs.com/package/pgmjs) by Vlad-Stefan Harbuz.

PNG conversion using [pngjs](https://github.com/lukeapage/pngjs).
