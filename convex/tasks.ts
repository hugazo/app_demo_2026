import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('tasks').collect();
  },
});

export const getPending = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('tasks')
      .filter(q => q.eq(q.field('isCompleted'), false))
      .first();
  },
});

export const getCompleted = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('tasks')
      .filter(q => q.eq(q.field('isCompleted'), true))
      .collect();
  },
});

export const complete = mutation({
  args: { id: v.id('tasks') },
  handler: async (ctx, args) => {
    const { id } = args;
    await ctx.db.patch('tasks', id, { isCompleted: true });
  },
});

export const dismiss = mutation({
  args: { id: v.id('tasks') },
  handler: async (ctx, args) => {
    const { id } = args;
    await ctx.db.delete('tasks', id);
  },
});

export const add = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const { text } = args;
    await ctx.db.insert('tasks', { text, isCompleted: false });
  },
});
