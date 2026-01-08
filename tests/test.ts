import * as path from 'path';
import { readPgmFromFile, convertToPng, savePngToFile, ColorMask } from '../dist/node';

const colorMasks: (ColorMask[] | undefined)[] = [
  undefined, // default
  [[1, 1, 1]],
  [[1, 0, 0]],
  [[0, 1, 0]],
  [[0, 0, 1]],
  [[1, 0, 1]],
  [[1, 1, 0]],
  [[0, 1, 1]],
  [[1, 0, 0], [0, 1, 0]],
  [[0, 0, 1], [0, 1, 0], [1, 0, 0]],
  [[0, 0, 1], [1, 0, 1], [1, 0, 0], [1, 1, 0]], // nice one!
  [[1, 1, 0], [1, 0.5, 0], [1, 0, 0], [1, 0, 1], [1, 1, 1]],
  [[0, 0, 1], [0, 0, 1], [1, 0, 0], [1, 0.5, 0], [0, 1, 1], [1, 0, 1]],
  [[0.5, 0, 0.5], [0.7, 0, 0.7], [1, 0, 1], [1, 0.5, 0], [1, 0, 0]],
];

async function testPgmFile(testFile: string, outputPrefix: string) {
  console.log(`\nTesting ${testFile}...`);
  
  try {
    const pgmData = await readPgmFromFile(path.join(__dirname, testFile));
    
    console.log('PGM Data:', {
      signature: pgmData.signature,
      width: pgmData.width,
      height: pgmData.height,
      maxval: pgmData.maxval,
      pixelCount: pgmData.pixels.length,
    });
    
    // Test each color mask
    for (let i = 0; i < colorMasks.length; i++) {
      const colorMask = colorMasks[i];
      const outputPath = path.join(__dirname, `${outputPrefix}_${i}.png`);
      
      const pngResult = await convertToPng(pgmData, { colorMasks: colorMask });
      await savePngToFile(pngResult, outputPath);
      
      console.log(`  ✓ Created ${outputPrefix}_${i}.png (${pngResult.width}x${pngResult.height})`);
    }
    
    console.log(`✓ Successfully processed ${testFile}`);
  } catch (error) {
    console.error(`✗ Error processing ${testFile}:`, error);
    throw error;
  }
}

async function main() {
  console.log('Starting PGM to PNG conversion tests...\n');
  
  await testPgmFile('p2.pgm', 'p2');
  await testPgmFile('p5.pgm', 'p5');
  
  console.log('\n✓ All tests completed successfully!');
}

main().catch((error) => {
  console.error('Test failed:', error);
  process.exit(1);
});
