import { query, mutation, type MutationCtx, type QueryCtx } from './_generated/server';
import { ConvexError, v } from 'convex/values';
import type { Id } from '@convex/_generated/dataModel';

const $requireAuth = async (ctx: MutationCtx | QueryCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity?.subject) {
    throw new ConvexError({
      message: 'Unauthenticated: You must be logged in to perform this action',
      error: 'UNAUTHENTICATED',
      code: 401,
    });
  }
  return { identity };
};

const $requireOwnTask = async (ctx: MutationCtx | QueryCtx, taskId: Id<'tasks'>, ownerId: string) => {
  const task = await ctx.db.get('tasks', taskId);
  if (!task || task.owner !== ownerId) {
    throw new ConvexError({
      message: 'Not found: No task found',
      error: 'NOT_FOUND',
      code: 404,
    });
  }
  return task;
};

export const list = query({
  args: {},
  handler: async (ctx) => {
    const { identity } = await $requireAuth(ctx);
    return await ctx.db
      .query('tasks')
      .withIndex('by_owner', q => q.eq('owner', identity.subject))
      .collect();
  },
});

export const setComplete = mutation({
  args: { taskId: v.id('tasks'), isCompleted: v.boolean() },
  handler: async (ctx, args) => {
    const { taskId, isCompleted } = args;
    const { identity } = await $requireAuth(ctx);
    await $requireOwnTask(ctx, taskId, identity.subject);
    await ctx.db.patch('tasks', taskId, { isCompleted });
  },
});

export const update = mutation({
  args: { taskId: v.id('tasks'), text: v.string() },
  handler: async (ctx, args) => {
    const { taskId, text } = args;
    const { identity } = await $requireAuth(ctx);
    if (text.length <= 3) {
      throw new ConvexError({
        message: 'Invalid task: Task text must be longer than 3 characters',
        error: 'PAYLOAD_INVALID',
        code: 422,
      });
    }
    await $requireOwnTask(ctx, taskId, identity.subject);
    await ctx.db.patch('tasks', taskId, { text });
  },
});

export const remove = mutation({
  args: { taskId: v.id('tasks') },
  handler: async (ctx, args) => {
    const { taskId } = args;
    const { identity } = await $requireAuth(ctx);
    await $requireOwnTask(ctx, taskId, identity.subject);
    await ctx.db.delete('tasks', taskId);
  },
});

export const create = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const { text } = args;
    const { identity } = await $requireAuth(ctx);
    if (text.length <= 3) {
      throw new ConvexError({
        message: 'Invalid task: Task text must be longer than 3 characters',
        error: 'PAYLOAD_INVALID',
        code: 422,
      });
    }
    await ctx.db.insert('tasks', { owner: identity.subject, text, isCompleted: false });
  },
});
