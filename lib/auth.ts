import type { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const cfgUser = process.env.AUTH_USERNAME || 'admin';
        const cfgHash = process.env.AUTH_PASSWORD_HASH || '';
        if (!credentials?.username || !credentials?.password) return null;
        if (credentials.username !== cfgUser) return null;
        if (!cfgHash) return null;
        const ok = await bcrypt.compare(credentials.password, cfgHash);
        if (!ok) return null;
        return { id: 'admin', name: 'Admin', email: 'admin@example.com' };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  secret: process.env.NEXTAUTH_SECRET,
};

