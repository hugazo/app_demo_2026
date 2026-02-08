import { query, mutation } from './_generated/server';
import { v } from 'convex/values';
import { customQuery, customMutation, customCtx } from 'convex-helpers/server/customFunctions';

const _handleUnauthenticated = () => {
  return {
    error: new Error('Unauthenticated'),
  };
};

const taskQuery = customQuery(
  query,
  customCtx(async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.subject) {
      throw _handleUnauthenticated();
    }
    console.log('Task Queried From:', identity.email);
    return { identity };
  }),
);

const taskMutation = customMutation(mutation, {
  args: {},
  input: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.subject) {
      throw _handleUnauthenticated();
    }
    console.log('Task Mutated From:', identity.email);
    return {
      ctx: { identity },
      args,
    };
  },
});

const taskSelfOwnedMutation = customMutation(mutation, {
  args: { id: v.id('tasks') },
  input: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.subject) {
      throw _handleUnauthenticated();
    }
    const { id } = args;
    const task = await ctx.db.get('tasks', id);
    if (!task || task.owner !== identity.subject) {
      throw new Error('Unauthorized: You do not own this task');
    }
    return {
      ctx: { identity },
      args,
    };
  },
});

export const getAll = taskQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('tasks')
      .withIndex('by_owner', q => q.eq('owner', ctx.identity.subject))
      .collect();
  },
});

export const getCompleted = taskQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('tasks')
      .filter(q => q.eq(q.field('isCompleted'), true))
      .collect();
  },
});

export const updateCompletionStatus = taskSelfOwnedMutation({
  args: { id: v.id('tasks'), isCompleted: v.boolean() },
  handler: async (ctx, args) => {
    const { id, isCompleted } = args;
    await ctx.db.patch('tasks', id, { isCompleted });
  },
});

export const dismiss = taskSelfOwnedMutation({
  args: { id: v.id('tasks') },
  handler: async (ctx, args) => {
    const { id } = args;
    await ctx.db.delete('tasks', id);
  },
});

export const add = taskMutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const { text } = args;
    await ctx.db.insert('tasks', { owner: ctx.identity.subject, text, isCompleted: false });
  },
});
