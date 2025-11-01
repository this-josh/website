import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Josh Kirk — Photography',
  description: 'Photography • Travel • Research',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
      </head>
      <body className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100">
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
