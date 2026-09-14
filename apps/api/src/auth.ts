import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db/index.js';
import { account, session, user, verification } from './db/schema.js';
import { env, googleAuthEnabled } from './env.js';
import { authEmail, sendEmail } from './lib/mailer.js';

const DAY = 60 * 60 * 24;

export const auth = betterAuth({
  appName: 'WatchGuru',
  // The browser reaches auth through the web app's /api/auth rewrite, so cookies
  // and OAuth callbacks live on the web origin.
  baseURL: env.WEB_URL,
  basePath: '/api/auth',
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: [env.WEB_URL],
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: { user, session, account, verification },
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
    resetPasswordTokenExpiresIn: 60 * 60,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: ({ user, url }) => sendEmail(authEmail('reset', user, url)),
  },
  emailVerification: {
    // Verification is encouraged but not required, so sign-up keeps working without an email provider.
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: ({ user, url }) => sendEmail(authEmail('verify', user, url)),
  },
  socialProviders: googleAuthEnabled
    ? { google: { clientId: env.GOOGLE_CLIENT_ID!, clientSecret: env.GOOGLE_CLIENT_SECRET! } }
    : undefined,
  user: {
    // Password accounts confirm with their password; social-only accounts need a fresh session.
    // Everything the user owns is removed by ON DELETE CASCADE.
    deleteUser: { enabled: true },
  },
  session: {
    freshAge: DAY,
    expiresIn: 30 * DAY,
    updateAge: DAY,
    // No cookie cache: revoked sessions (e.g. after a password reset) must stop working immediately.
  },
  advanced: {
    useSecureCookies: env.NODE_ENV === 'production',
    ipAddress: { ipAddressHeaders: ['x-forwarded-for', 'x-real-ip'] },
  },
});

export type AuthUser = typeof auth.$Infer.Session.user;
