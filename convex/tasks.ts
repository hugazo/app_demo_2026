import { query, mutation, type MutationCtx, type QueryCtx } from './_generated/server';
import { ConvexError, v } from 'convex/values';
import type { Id } from '@convex/_generated/dataModel';

const $handleUnauthenticated = (_ctx: MutationCtx | QueryCtx) => {
  return {
    error: new ConvexError({
      message: 'Unauthenticated: You must be logged in to perform this action',
      error: 'UNAUTHENTICATED',
      code: 401,
    }),
  };
};

const $authenticate = async (ctx: MutationCtx | QueryCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity?.subject) {
    throw $handleUnauthenticated(ctx);
  }
  return { identity };
};

const $getOwnTask = async (ctx: MutationCtx | QueryCtx, taskId: Id<'tasks'>, ownerId: string) => {
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

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const { identity } = await $authenticate(ctx);
    return await ctx.db
      .query('tasks')
      .withIndex('by_owner', q => q.eq('owner', identity.subject))
      .collect();
  },
});

export const updateCompletionStatus = mutation({
  args: { id: v.id('tasks'), isCompleted: v.boolean() },
  handler: async (ctx, args) => {
    const { id, isCompleted } = args;
    const { identity } = await $authenticate(ctx);
    await $getOwnTask(ctx, id, identity.subject);
    await ctx.db.patch('tasks', id, { isCompleted });
  },
});

export const editText = mutation({
  args: { id: v.id('tasks'), text: v.string() },
  handler: async (ctx, args) => {
    const { id, text } = args;
    const { identity } = await $authenticate(ctx);
    if (text.length <= 3) {
      throw new ConvexError({
        message: 'Invalid task: Task text must be longer than 3 characters',
        error: 'PAYLOAD_INVALID',
        code: 422,
      });
    }
    await $getOwnTask(ctx, id, identity.subject);
    await ctx.db.patch('tasks', id, { text });
  },
});

export const dismiss = mutation({
  args: { id: v.id('tasks') },
  handler: async (ctx, args) => {
    const { id } = args;
    const { identity } = await $authenticate(ctx);
    await $getOwnTask(ctx, id, identity.subject);
    await ctx.db.delete('tasks', id);
  },
});

export const add = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const { text } = args;
    const { identity } = await $authenticate(ctx);
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
