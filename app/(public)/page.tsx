import nextDynamic from 'next/dynamic';
import { promises as fs } from 'fs';
import path from 'path';

const HeroCarousel = nextDynamic(() => import('../../components/HeroCarousel'), { ssr: false });

type HeroEntry = { src: string; depth?: string };

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const file = path.join(process.cwd(), 'data', 'hero.manifest.json');
  let entries: HeroEntry[] = [];
  try {
    const raw = await fs.readFile(file, 'utf8');
    const json = JSON.parse(raw);
    entries = json.entries || [];
  } catch {}

  if (!entries.length) entries = [{ src: '/hero.jpg', depth: '/hero-depth.png' }];
  return <HeroCarousel entries={entries} />;
}
