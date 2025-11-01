export default function Footer() {
  return (
    <footer className="border-t border-neutral-800 text-neutral-400">
      <div className="mx-auto max-w-6xl p-4 text-sm">
        © {new Date().getFullYear()} Josh Kirk. All rights reserved.
      </div>
    </footer>
  );
}

