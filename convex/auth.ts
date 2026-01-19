import { createClient, type GenericCtx, type AuthFunctions } from '@convex-dev/better-auth';
import { convex } from '@convex-dev/better-auth/plugins';
import { betterAuth } from 'better-auth';

import type { DataModel } from './_generated/dataModel';
import { components, internal } from './_generated/api';
import authConfig from './auth.config';

// App URL for trusted origins
const siteUrl = process.env.SITE_URL!;

const convexSiteUrl = process.env.CONVEX_SITE_URL!; // Convex HTTP endpoint (for baseURL)

const authFunctions: AuthFunctions = internal.auth;

// Create the auth component client with triggers to sync users
export const authComponent = createClient<DataModel>(components.betterAuth, {
  authFunctions,
  triggers: {
    user: {
      // Auto-create user in our table when Better Auth creates one
      onCreate: async (ctx, doc) => {
        const now = Date.now();
        await ctx.db.insert('users', {
          authId: doc._id,
          displayName: doc.name,
          email: doc.email,
          avatarUrl: doc.image ?? undefined,
          createdAt: now,
          updatedAt: now,
        });
      },
      // Sync name and email changes
      onUpdate: async (ctx, newDoc, oldDoc) => {
        const nameChanged = newDoc.name !== oldDoc.name;
        const emailChanged = newDoc.email !== oldDoc.email;
        const imageChanged = newDoc.image !== oldDoc.image;
        if (nameChanged || emailChanged || imageChanged) {
          const user = await ctx.db
            .query('users')
            .withIndex('by_auth_id', q => q.eq('authId', newDoc._id))
            .first();
          if (user) {
            await ctx.db.patch(user._id, {
              ...(nameChanged && { displayName: newDoc.name }),
              ...(emailChanged && { email: newDoc.email }),
              ...(imageChanged && { avatarUrl: newDoc.image ?? undefined }),
              updatedAt: Date.now(),
            });
          }
        }
      },
      // Delete from our table when auth user is deleted
      onDelete: async (ctx, doc) => {
        const user = await ctx.db
          .query('users')
          .withIndex('by_auth_id', q => q.eq('authId', doc._id))
          .first();
        if (user) {
          await ctx.db.delete(user._id);
        }
      },
    },
  },
});

// Factory function to create auth instance per request
export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    baseURL: convexSiteUrl,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
    },
    plugins: [
      convex({ authConfig }),
    ],
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
    },
    trustedOrigins: [siteUrl],
  });
};

// Export trigger handlers for the component
export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi();
