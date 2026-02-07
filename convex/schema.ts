import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema(
  {
    tasks: defineTable({
      owner: v.string(),
      text: v.string(),
      isCompleted: v.boolean(),
    }).index('by_owner', ['owner']),
  },
);
