import GalleryGrid from '../../../components/GalleryGrid';
import { promises as fs } from 'fs';
import path from 'path';

export default async function PrivatePhotosPage() {
  const file = path.join(process.cwd(), 'data', 'photos.manifest.json');
  const raw = await fs.readFile(file, 'utf8');
  const manifest = JSON.parse(raw);
  const privateAlbums = manifest.albums.filter((a: any) => a.private);
  const photos = privateAlbums.flatMap((a: any) => a.items.map((p: any) => ({ ...p, album: a.slug })));
  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-3xl font-semibold mb-4">Private Albums</h1>
      <p className="text-neutral-300 mb-6">Access restricted to authenticated users.</p>
      <GalleryGrid items={photos} />
    </div>
  );
}
