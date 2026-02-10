<template>
  <ion-modal
    ref="modal"
    :is-open="open"
    @keyup.esc="open = false"
  >
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="secondary">
          <ion-button @click="open = false">
            Cancel
          </ion-button>
        </ion-buttons>
        <ion-title>Add Task</ion-title>
        <ion-buttons slot="end">
          <ion-button
            :strong="true"
            @click="newTaskHandler"
          >
            Confirm
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-input
          v-model="taskName"
          label="Enter the task name"
          label-placement="stacked"
          type="text"
          placeholder="Do something..."
          @keyup.enter="newTaskHandler"
        />
      </ion-item>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
const taskName = defineModel<string>('taskName', { required: true });
const open = defineModel<boolean>('open');

const newTaskHandler = inject(NewTaskHandlerKey) as NewTaskHandler;
</script>
