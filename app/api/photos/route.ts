import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const albumFilter = searchParams.get('album');

  const file = path.join(process.cwd(), 'data', 'photos.manifest.json');
  const raw = await fs.readFile(file, 'utf8');
  const manifest = JSON.parse(raw);

  let out = manifest;
  if (albumFilter) {
    out = { ...manifest, albums: manifest.albums.filter((a: any) => a.slug === albumFilter) };
  }

  return NextResponse.json(out);
}

