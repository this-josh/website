'use client';
import { useEffect, useMemo, useState } from 'react';
import HeroCanvas from './HeroCanvas';

type Entry = { src: string; depth?: string };

export default function HeroDebug({ entries }: { entries: Entry[] }) {
  const [idx, setIdx] = useState<number>(0);

  useEffect(() => {
    const saved = Number(localStorage.getItem('debugHeroIdx') || '0') || 0;
    // advance one on load to simulate cycling with refresh
    const next = (saved + 1) % Math.max(entries.length, 1);
    setIdx(next);
    localStorage.setItem('debugHeroIdx', String(next));
  }, [entries.length]);

  const cur = useMemo(() => entries[idx] || entries[0], [entries, idx]);

  return (
    <div className="relative">
      <HeroCanvas src={cur?.src} depthSrc={cur?.depth} />
      <div className="absolute bottom-4 left-4 z-50 flex items-center gap-2 text-white/90">
        <button onClick={() => setIdx((i) => (i - 1 + entries.length) % entries.length)} className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded">Prev</button>
        <button onClick={() => setIdx((i) => (i + 1) % entries.length)} className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded">Next</button>
        <span className="ml-2 text-sm opacity-80">{idx + 1}/{entries.length} — {cur?.src?.split('/').pop()}</span>
      </div>
    </div>
  );
}

