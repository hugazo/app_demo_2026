import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Id } from '@convex/_generated/dataModel';
import TaskModal from '@/components/task/modal.vue';
import type { Task } from '@/composables/useTasks';
import {
  TaskNameKey,
  OpenTaskModalKey,
  ResetTaskFormKey,
  NewTaskHandlerKey,
  CurrentTaskKey,
  TaskEditHandlerKey,
  FormErrorKey,
} from '@/composables/useTasks';

describe('TaskModal', () => {
  const mockResetForm = vi.fn();
  const mockNewTaskHandler = vi.fn();
  const mockTaskEditHandler = vi.fn();

  let taskName: Ref<string>;
  let open: Ref<boolean>;
  let currentTask: Ref<Task | null>;
  let taskFormError: Ref<string | null>;

  const mockTask = {
    _id: 't1' as Id<'tasks'>,
    _creationTime: 0,
    owner: 'u1',
    text: 'Existing task',
    isCompleted: false,
  } as Task;

  beforeEach(() => {
    vi.clearAllMocks();

    taskName = ref('');
    open = ref(true);
    currentTask = ref(null);
    taskFormError = ref(null);
  });

  const IonInputStub = defineComponent({
    name: 'IonInput',
    inheritAttrs: true,
    props: ['modelValue', 'autofocus', 'label', 'labelPlacement', 'type', 'errorText', 'placeholder'],
    emits: ['update:modelValue'],
    template: '<input />',
  });

  const mountComponent = () =>
    mount(TaskModal, {
      global: {
        provide: {
          [TaskNameKey as symbol]: taskName,
          [OpenTaskModalKey as symbol]: open,
          [ResetTaskFormKey as symbol]: mockResetForm,
          [NewTaskHandlerKey as symbol]: mockNewTaskHandler,
          [CurrentTaskKey as symbol]: currentTask,
          [TaskEditHandlerKey as symbol]: mockTaskEditHandler,
          [FormErrorKey as symbol]: taskFormError,
        },
        stubs: {
          'ion-modal': { template: '<div><slot /></div>' },
        },
        components: {
          IonInput: IonInputStub,
        },
      },
    });

  it('shows "Add Task" title when no current task', () => {
    const wrapper = mountComponent();

    expect(wrapper.find('ion-title').text()).toBe('Add Task');
  });

  it('shows "Edit Task" title when a current task is set', () => {
    currentTask.value = mockTask;

    const wrapper = mountComponent();

    expect(wrapper.find('ion-title').text()).toBe('Edit Task');
  });

  it('shows Create button when no current task', () => {
    const wrapper = mountComponent();

    const buttons = wrapper.findAll('ion-buttons[slot="end"] ion-button');
    expect(buttons).toHaveLength(1);
    expect(buttons[0]!.text()).toBe('Create');
  });

  it('shows Edit button when current task is set', () => {
    currentTask.value = mockTask;

    const wrapper = mountComponent();

    const buttons = wrapper.findAll('ion-buttons[slot="end"] ion-button');
    expect(buttons).toHaveLength(1);
    expect(buttons[0]!.text()).toBe('Edit');
  });

  it('calls resetForm when Cancel is clicked', async () => {
    const wrapper = mountComponent();

    await wrapper.find('ion-buttons[slot="secondary"] ion-button').trigger('click');

    expect(mockResetForm).toHaveBeenCalled();
  });

  it('calls newTaskHandler when Create is clicked', async () => {
    const wrapper = mountComponent();

    await wrapper.find('ion-buttons[slot="end"] ion-button').trigger('click');

    expect(mockNewTaskHandler).toHaveBeenCalled();
  });

  it('calls taskEditHandler when Edit is clicked', async () => {
    currentTask.value = mockTask;
    taskName.value = 'Updated task';

    const wrapper = mountComponent();

    await wrapper.find('ion-buttons[slot="end"] ion-button').trigger('click');

    expect(mockTaskEditHandler).toHaveBeenCalledWith({ id: 't1', text: 'Updated task' });
  });

  it('applies ion-invalid class when taskFormError is set', () => {
    taskFormError.value = 'Task name too short';

    const wrapper = mountComponent();

    const input = wrapper.findComponent(IonInputStub);
    expect(input.classes()).toContain('ion-invalid');
    expect(input.classes()).not.toContain('ion-valid');
    expect(input.props('errorText')).toBe('Task name too short');
  });

  it('does not set error-text when taskFormError is null', () => {
    const wrapper = mountComponent();

    const input = wrapper.findComponent(IonInputStub);
    expect(input.props('errorText')).not.toEqual(expect.any(String));
  });

  it('applies ion-valid class when no error and name >= 4 chars', () => {
    taskName.value = 'Good';

    const wrapper = mountComponent();

    const input = wrapper.findComponent(IonInputStub);
    expect(input.classes()).toContain('ion-valid');
    expect(input.classes()).not.toContain('ion-invalid');
  });

  it('sets open to false on Escape keyup', async () => {
    expect(open.value).toBe(true);

    const wrapper = mountComponent();

    await wrapper.trigger('keyup', { key: 'Escape' });

    expect(open.value).toBe(false);
  });

  it('calls newTaskHandler on Enter key in input (create mode)', async () => {
    const wrapper = mountComponent();

    const input = wrapper.findComponent(IonInputStub);
    await input.trigger('keyup', { key: 'Enter' });

    expect(mockNewTaskHandler).toHaveBeenCalled();
  });

  it('calls taskEditHandler on Enter key in input (edit mode)', async () => {
    currentTask.value = mockTask;
    taskName.value = 'Updated task';

    const wrapper = mountComponent();

    const input = wrapper.findComponent(IonInputStub);
    await input.trigger('keyup', { key: 'Enter' });

    expect(mockTaskEditHandler).toHaveBeenCalledWith({ id: 't1', text: 'Updated task' });
  });

  it('updates taskName when ion-input emits update:modelValue', async () => {
    const wrapper = mountComponent();

    await wrapper.findComponent(IonInputStub).vm.$emit('update:modelValue', 'New value');

    expect(taskName.value).toBe('New value');
  });
});
