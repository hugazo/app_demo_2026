<template>
  <ion-page>
    <ion-content>
      <ion-tabs>
        <ion-router-outlet />

        <ion-tab-bar slot="bottom">
          <ion-tab-button
            tab="home"
            href="/tabs/home"
          >
            <ion-icon :icon="ioniconsHomeOutline" />
            <ion-label>Home</ion-label>
          </ion-tab-button>

          <ion-tab-button
            tab="tasks"
            href="/tabs/tasks"
          >
            <ion-icon :icon="ioniconsList" />
            <ion-label>Tasks</ion-label>
          </ion-tab-button>

          <ion-tab-button
            tab="settings"
            href="/tabs/settings"
          >
            <ion-icon :icon="ioniconsCog" />
            <ion-label>Settings</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    </ion-content>
  </ion-page>
</template>
