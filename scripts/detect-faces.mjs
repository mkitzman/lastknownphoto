/**
 * Scans all post images for faces and writes focalPoint {x, y} (as percentages)
 * into each post's JSON file. Run with: node scripts/detect-faces.mjs
 */
import * as faceapi from '@vladmandic/face-api';
import canvas from 'canvas';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'content', 'posts');
const IMAGES_DIR = path.join(ROOT, 'public', 'images');
const MODEL_DIR = path.join(ROOT, 'node_modules', '@vladmandic', 'face-api', 'model');

// Patch face-api to use node-canvas
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

async function loadModels() {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_DIR);
  console.log('Face detection model loaded.');
}

async function detectFocalPoint(imagePath) {
  try {
    const img = await canvas.loadImage(imagePath);
    const detections = await faceapi.detectAllFaces(img, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.3 }));

    if (detections.length === 0) return null;

    // Average the center of all detected faces
    let sumX = 0, sumY = 0;
    for (const det of detections) {
      sumX += det.box.x + det.box.width / 2;
      sumY += det.box.y + det.box.height / 2;
    }
    const avgX = sumX / detections.length;
    const avgY = sumY / detections.length;

    // Convert to percentage of image dimensions
    const x = Math.round((avgX / img.width) * 100);
    const y = Math.round((avgY / img.height) * 100);

    return { x, y, faces: detections.length };
  } catch (err) {
    console.error(`  Error processing ${imagePath}: ${err.message}`);
    return null;
  }
}

async function main() {
  await loadModels();

  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.json'));
  let detected = 0, skipped = 0, noFace = 0;

  for (const file of files) {
    const jsonPath = path.join(POSTS_DIR, file);
    const post = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    // Resolve image path
    const imageFile = post.imageUrl.replace(/^\/images\//, '');
    const imagePath = path.join(IMAGES_DIR, imageFile);

    if (!fs.existsSync(imagePath)) {
      console.log(`  SKIP ${file} — image not found: ${imageFile}`);
      skipped++;
      continue;
    }

    process.stdout.write(`Processing ${file}...`);
    const result = await detectFocalPoint(imagePath);

    if (result) {
      post.focalPoint = { x: result.x, y: result.y };
      fs.writeFileSync(jsonPath, JSON.stringify(post, null, 2) + '\n');
      console.log(` face at ${result.x}%,${result.y}% (${result.faces} face(s))`);
      detected++;
    } else {
      // Default to center if no face found
      if (!post.focalPoint) {
        post.focalPoint = { x: 50, y: 50 };
        fs.writeFileSync(jsonPath, JSON.stringify(post, null, 2) + '\n');
      }
      console.log(` no face detected, defaulting to center`);
      noFace++;
    }
  }

  console.log(`\nDone! ${detected} faces detected, ${noFace} no face, ${skipped} skipped.`);
}

main().catch(console.error);
