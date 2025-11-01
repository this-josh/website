import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const cfgUser = process.env.AUTH_USERNAME || 'admin';
        const cfgHash = process.env.AUTH_PASSWORD_HASH || '';
        if (!credentials?.username || !credentials?.password) return null;
        const userOk = credentials.username === cfgUser;
        const hasHash = !!cfgHash;
        const ok = hasHash ? await bcrypt.compare(credentials.password, cfgHash) : false;
        if (!(userOk && ok)) return null;
        return { id: 'admin', name: 'Admin', email: 'admin@example.com' };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
