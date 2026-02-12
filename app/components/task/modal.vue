<template>
  <ion-modal
    ref="modal"
    :is-open="open"
    @keyup.esc="open = false"
  >
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="secondary">
          <ion-button @click="resetForm()">
            Cancel
          </ion-button>
        </ion-buttons>
        <ion-title>{{ currentTask ? 'Edit Task' : 'Add Task' }}</ion-title>
        <ion-buttons slot="end">
          <ion-button
            v-if="currentTask"
            :strong="true"
            @click="taskEditHandler({ id: currentTask._id, text: taskName })"
          >
            Edit
          </ion-button>
          <ion-button
            v-else
            :strong="true"
            @click="newTaskHandler"
          >
            Create
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-input
          v-model="taskName"
          :class="{
            'ion-invalid': taskFormError,
            'ion-valid': !taskFormError && taskName.length >= 4,
            'ion-touched': true,
          }"
          :autofocus="true"
          :label="`${currentTask ? 'Edit' : 'Enter'} the task name`"
          label-placement="stacked"
          type="text"
          :error-text="taskFormError ? taskFormError : undefined"
          placeholder="Do something..."
          @keyup.enter="currentTask
            ? taskEditHandler({ id: currentTask._id, text: taskName })
            : newTaskHandler()"
        />
      </ion-item>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
const taskName = inject(TaskNameKey) as Ref<string>;
const open = inject(OpenTaskModalKey) as Ref<boolean>;

const resetForm = inject(ResetTaskFormKey) as () => void;
const newTaskHandler = inject(NewTaskHandlerKey) as NewTaskHandler;

const currentTask = inject(CurrentTaskKey);
const taskEditHandler = inject(TaskEditHandlerKey) as TaskEditHandler;
const taskFormError = inject(FormErrorKey) as Ref<string | null>;
</script>
