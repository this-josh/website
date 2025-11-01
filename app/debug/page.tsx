import { promises as fs } from 'fs';
import path from 'path';
import nextDynamic from 'next/dynamic';

const HeroDebug = nextDynamic(() => import('../../components/HeroDebug'), { ssr: false });

type HeroEntry = { src: string; depth?: string };

export const dynamic = 'force-dynamic';

export default async function DebugPage() {
  const file = path.join(process.cwd(), 'data', 'hero.manifest.json');
  let entries: HeroEntry[] = [];
  try {
    const raw = await fs.readFile(file, 'utf8');
    const json = JSON.parse(raw);
    entries = json.entries || [];
  } catch {}
  return <HeroDebug entries={entries} />;
}
