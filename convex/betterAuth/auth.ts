import { createClient } from '@convex-dev/better-auth';
import { convex, crossDomain } from '@convex-dev/better-auth/plugins';
import type { GenericCtx } from '@convex-dev/better-auth/utils';
import type { BetterAuthOptions } from 'better-auth';
import { betterAuth } from 'better-auth';
import { components } from '../_generated/api';
import type { DataModel } from '../_generated/dataModel';
import authConfig from '../auth.config';
import schema from './schema';

const siteUrl = process.env.SITE_URL!;

const convexSiteUrl = process.env.CONVEX_SITE_URL!;
const betterAuthSecret = process.env.BETTER_AUTH_SECRET!;

// Better Auth Component
export const authComponent = createClient<DataModel, typeof schema>(
  components.betterAuth,
  {
    local: { schema },
    verbose: false,
  },
);

// Better Auth Options
export const createAuthOptions = (ctx: GenericCtx<DataModel>) => {
  return {
    // appName: 'QrApp',
    baseURL: convexSiteUrl,
    secret: betterAuthSecret,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
    },
    plugins: [
      convex({ authConfig }),
      crossDomain({ siteUrl }),
    ],
    trustedOrigins: [
      siteUrl,
    ],
  } satisfies BetterAuthOptions;
};

// For `@better-auth/cli`
export const options = createAuthOptions({} as GenericCtx<DataModel>);

export type Session = ReturnType<typeof createAuth>['$Infer']['Session'];

// Better Auth Instance
export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth(createAuthOptions(ctx));
};
