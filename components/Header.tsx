import Link from 'next/link';

export default function Header() {
  return (
    <header className="absolute top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-6xl flex items-center justify-end p-4">
        <nav className="flex items-center gap-6 text-white">
          <Link href="/photos">Photos</Link>
          <Link href="/about">About</Link>
        </nav>
      </div>
    </header>
  );
}
