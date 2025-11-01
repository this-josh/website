'use client';
import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

function LoginInner() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const sp = useSearchParams();
  const error = sp.get('error');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn('credentials', {
      username,
      password,
      redirect: true,
      callbackUrl: '/private/photos',
    });
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-sm p-6">
      <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
      {error && <p className="text-red-400 mb-2">{error}</p>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Username</label>
          <input className="w-full rounded bg-neutral-900 border border-neutral-700 px-3 py-2" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input type="password" className="w-full rounded bg-neutral-900 border border-neutral-700 px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button disabled={loading} className="rounded bg-white text-black px-4 py-2 font-medium disabled:opacity-60">{loading ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  );
}

export default function LoginPage(){
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
