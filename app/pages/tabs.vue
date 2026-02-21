<template>
  <ion-page>
    <ion-content>
      <ion-tabs>
        <ion-router-outlet
          :animate="true"
        />

        <ion-tab-bar slot="bottom">
          <template
            v-for="tab in tabLinks"
            :key="tab.name"
          >
            <ion-tab-button
              :selected="route.path === `/tabs/${tab.path}`"
              @click="handleTabChange(tab.path)"
            >
              <ion-icon :icon="tab.icon" />
              <ion-label class="ion-text-uppercase">
                {{ tab.path }}
              </ion-label>
            </ion-tab-button>
          </template>
        </ion-tab-bar>
      </ion-tabs>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
// Avoids auto import from nuxt
import { useRoute } from 'vue-router';

const { tabLinks, handleTabChange } = useTabs();

const route = useRoute();
</script>
