'use client';
import { useEffect, useMemo, useState } from 'react';
import HeroCanvas from './HeroCanvas';

type Entry = { src: string; depth?: string };

export default function HeroCarousel({ entries }: { entries: Entry[] }) {
  const initial = useMemo(() => (entries.length ? Math.floor(Math.random() * entries.length) : 0), [entries.length]);
  const [idx, setIdx] = useState<number>(initial);
  const cur = entries[idx] || entries[0];

  const prev = () => entries.length && setIdx((i) => (i - 1 + entries.length) % entries.length);
  const next = () => entries.length && setIdx((i) => (i + 1) % entries.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [entries.length]);

  return (
    <div className="relative">
      {cur && <HeroCanvas src={cur.src} depthSrc={cur.depth} />}
      <div className="absolute bottom-4 left-4 z-50 flex items-center gap-4">
        <button
          onClick={prev}
          className="px-4 py-2 rounded bg-white/20 hover:bg-white/30 text-white backdrop-blur-md"
        >
          Prev
        </button>
        <button
          onClick={next}
          className="px-4 py-2 rounded bg-white/20 hover:bg-white/30 text-white backdrop-blur-md"
        >
          Next
        </button>
      </div>
    </div>
  );
}
