#!/usr/bin/env node
// Build responsive thumbnails and a manifest from a source folder.
// Requires: sharp, globby
import fs from 'node:fs/promises';
import path from 'node:path';
import { globby } from 'globby';
import sharp from 'sharp';

const SRC = process.env.GALLERY_SRC || './NAS/albums';
const OUT = process.env.GALLERY_OUT || './public/photos';

const THUMBS_DIR = path.join(OUT, 'sample', 'thumbs');
const FULL_DIR = path.join(OUT, 'sample', 'full');
const MANIFEST = './data/photos.manifest.json';

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function main() {
  await ensureDir(THUMBS_DIR);
  await ensureDir(FULL_DIR);

  const patterns = ['**/*.{jpg,jpeg,png,webp}'];
  const source = path.resolve(SRC);
  const files = await globby(patterns, { cwd: source });

  const items = [];
  for (const rel of files) {
    const srcPath = path.join(source, rel);
    const base = path.basename(rel);
    const fullOut = path.join(FULL_DIR, base.replace(/\.(png)$/i, '.jpg'));
    const thumbOut = path.join(THUMBS_DIR, base.replace(/\.(png)$/i, '.jpg'));

    const img = sharp(srcPath);
    const meta = await img.metadata();

    // Write full (normalized jpeg/webp)
    await img.jpeg({ quality: 88 }).toFile(fullOut);
    // Write thumb (width ~720)
    await img.resize({ width: 720 }).jpeg({ quality: 80 }).toFile(thumbOut);

    items.push({
      src: fullOut.replace(/^\.\/public/, ''),
      thumb: thumbOut.replace(/^\.\/public/, ''),
      width: meta.width || 2048,
      height: meta.height || 1365,
      alt: base,
    });
  }

  const manifest = {
    albums: [
      {
        title: 'Generated',
        slug: 'generated',
        private: false,
        items,
      },
    ],
  };

  await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2));
  console.log(`Wrote ${items.length} items → ${MANIFEST}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

