import { convexTest } from 'convex-test';
import { describe, expect, test } from 'vitest';
import { ConvexError } from 'convex/values';
import { api } from '@convex/_generated/api';
import schema from '@convex/schema';

const modules = import.meta.glob('../../convex/**/*.ts');

const setupAuthenticatedTest = () => {
  const t = convexTest(schema, modules);
  return t.withIdentity({ subject: 'user1' });
};

describe('tasks api', () => {
  describe('list', () => {
    test('throws when unauthenticated', async () => {
      const t = convexTest(schema, modules);

      await expect(t.query(api.tasks.list)).rejects.toThrow();
    });

    test('returns empty array when user has no tasks', async () => {
      const t = setupAuthenticatedTest();

      const tasks = await t.query(api.tasks.list);

      expect(tasks).toEqual([]);
    });

    test('returns only tasks owned by the authenticated user', async () => {
      const t = convexTest(schema, modules);
      const user1 = t.withIdentity({ subject: 'user1' });
      const user2 = t.withIdentity({ subject: 'user2' });

      await user1.mutation(api.tasks.create, { text: 'My task' });
      await user2.mutation(api.tasks.create, { text: 'Other task' });

      const tasks = await user1.query(api.tasks.list);

      expect(tasks).toHaveLength(1);
      expect(tasks[0]!.text).toBe('My task');
      expect(tasks[0]!.owner).toBe('user1');
    });
  });

  describe('create', () => {
    test('throws when unauthenticated', async () => {
      const t = convexTest(schema, modules);

      await expect(t.mutation(api.tasks.create, { text: 'Test task' })).rejects.toThrow();
    });

    test('creates a task with isCompleted set to false', async () => {
      const t = setupAuthenticatedTest();

      await t.mutation(api.tasks.create, { text: 'New task' });

      const tasks = await t.query(api.tasks.list);

      expect(tasks).toHaveLength(1);
      expect(tasks[0]).toMatchObject({
        owner: 'user1',
        text: 'New task',
        isCompleted: false,
      });
    });

    test('throws when text is 3 characters or fewer', async () => {
      const t = setupAuthenticatedTest();

      await expect(t.mutation(api.tasks.create, { text: 'abc' })).rejects.toThrow(ConvexError);
    });

    test('accepts text longer than 3 characters', async () => {
      const t = setupAuthenticatedTest();

      await t.mutation(api.tasks.create, { text: 'abcd' });

      const tasks = await t.query(api.tasks.list);
      expect(tasks).toHaveLength(1);
    });
  });

  describe('setComplete', () => {
    test('throws when unauthenticated', async () => {
      const t = setupAuthenticatedTest();
      await t.mutation(api.tasks.create, { text: 'Test task' });
      const [task] = await t.query(api.tasks.list);

      const unauthed = convexTest(schema, modules);
      await expect(unauthed.mutation(api.tasks.setComplete, { taskId: task!._id, isCompleted: true })).rejects.toThrow();
    });

    test('toggles task completion status', async () => {
      const t = setupAuthenticatedTest();

      await t.mutation(api.tasks.create, { text: 'Toggle me' });
      const [task] = await t.query(api.tasks.list);

      await t.mutation(api.tasks.setComplete, { taskId: task!._id, isCompleted: true });

      const [updated] = await t.query(api.tasks.list);
      expect(updated!.isCompleted).toBe(true);
    });

    test('throws when task belongs to another user', async () => {
      const t = convexTest(schema, modules);
      const user1 = t.withIdentity({ subject: 'user1' });
      const user2 = t.withIdentity({ subject: 'user2' });

      await user1.mutation(api.tasks.create, { text: 'My task' });
      const [task] = await user1.query(api.tasks.list);

      await expect(user2.mutation(api.tasks.setComplete, { taskId: task!._id, isCompleted: true })).rejects.toThrow(ConvexError);
    });
  });

  describe('update', () => {
    test('throws when unauthenticated', async () => {
      const t = setupAuthenticatedTest();
      await t.mutation(api.tasks.create, { text: 'Test task' });
      const [task] = await t.query(api.tasks.list);

      const unauthed = convexTest(schema, modules);
      await expect(unauthed.mutation(api.tasks.update, { taskId: task!._id, text: 'Updated' })).rejects.toThrow();
    });

    test('updates task text', async () => {
      const t = setupAuthenticatedTest();

      await t.mutation(api.tasks.create, { text: 'Original' });
      const [task] = await t.query(api.tasks.list);

      await t.mutation(api.tasks.update, { taskId: task!._id, text: 'Updated text' });

      const [updated] = await t.query(api.tasks.list);
      expect(updated!.text).toBe('Updated text');
    });

    test('throws when new text is 3 characters or fewer', async () => {
      const t = setupAuthenticatedTest();

      await t.mutation(api.tasks.create, { text: 'Original' });
      const [task] = await t.query(api.tasks.list);

      await expect(t.mutation(api.tasks.update, { taskId: task!._id, text: 'abc' })).rejects.toThrow(ConvexError);
    });

    test('throws when task belongs to another user', async () => {
      const t = convexTest(schema, modules);
      const user1 = t.withIdentity({ subject: 'user1' });
      const user2 = t.withIdentity({ subject: 'user2' });

      await user1.mutation(api.tasks.create, { text: 'My task' });
      const [task] = await user1.query(api.tasks.list);

      await expect(user2.mutation(api.tasks.update, { taskId: task!._id, text: 'Stolen' })).rejects.toThrow(ConvexError);
    });
  });

  describe('remove', () => {
    test('throws when unauthenticated', async () => {
      const t = setupAuthenticatedTest();
      await t.mutation(api.tasks.create, { text: 'Test task' });
      const [task] = await t.query(api.tasks.list);

      const unauthed = convexTest(schema, modules);
      await expect(unauthed.mutation(api.tasks.remove, { taskId: task!._id })).rejects.toThrow();
    });

    test('deletes the task', async () => {
      const t = setupAuthenticatedTest();

      await t.mutation(api.tasks.create, { text: 'Delete me' });
      const [task] = await t.query(api.tasks.list);

      await t.mutation(api.tasks.remove, { taskId: task!._id });

      const tasks = await t.query(api.tasks.list);
      expect(tasks).toHaveLength(0);
    });

    test('throws when task belongs to another user', async () => {
      const t = convexTest(schema, modules);
      const user1 = t.withIdentity({ subject: 'user1' });
      const user2 = t.withIdentity({ subject: 'user2' });

      await user1.mutation(api.tasks.create, { text: 'My task' });
      const [task] = await user1.query(api.tasks.list);

      await expect(user2.mutation(api.tasks.remove, { taskId: task!._id })).rejects.toThrow(ConvexError);
    });
  });
});
