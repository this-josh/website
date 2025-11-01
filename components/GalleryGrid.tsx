"use client";
import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';

type Photo = {
  src: string;
  width: number;
  height: number;
  alt?: string;
  thumb?: string;
  album?: string;
};

const Lightbox = dynamic(() => import('yet-another-react-lightbox'), { ssr: false });

export default function GalleryGrid({ items }: { items: Photo[] }) {
  const [index, setIndex] = useState<number>(-1);
  const slides = useMemo(() => items.map((p) => ({ src: p.src })), [items]);

  return (
    <div>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]
                      *:mb-4">
        {items.map((p, i) => (
          <button
            key={p.src + i}
            className="block w-full overflow-hidden rounded-lg bg-neutral-900 border border-neutral-800 hover:opacity-95 focus:outline-none"
            onClick={() => setIndex(i)}
            title={p.alt || ''}
          >
            {/* Use plain img to avoid next/image domain config hassles */}
            <img
              src={p.thumb || p.src}
              alt={p.alt || ''}
              style={{ width: '100%', height: 'auto' }}
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {typeof window !== 'undefined' && (
        // @ts-ignore types only available at runtime after install
        <Lightbox open={index >= 0} close={() => setIndex(-1)} index={index} slides={slides} />
      )}
    </div>
  );
}

