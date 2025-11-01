import GalleryGrid from '../../components/GalleryGrid';
import { promises as fs } from 'fs';
import path from 'path';

export default async function PublicPhotosPage() {
  const file = path.join(process.cwd(), 'data', 'photos.manifest.json');
  const raw = await fs.readFile(file, 'utf8');
  const manifest = JSON.parse(raw);
  const publicAlbums = manifest.albums.filter((a: any) => !a.private);
  const photos = publicAlbums.flatMap((a: any) => a.items.map((p: any) => ({ ...p, album: a.slug })));
  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-3xl font-semibold mb-4">Photos</h1>
      <GalleryGrid items={photos} />
    </div>
  );
}
