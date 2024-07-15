import { createApp } from 'vue';
export const HelperCreateApp = (component: any) => {
  let appData = {};
  let appDataDom = document.getElementById('app-data') as any;
  let app = createApp(component);

  if (appDataDom && appDataDom.innerText != '') {
    try {
      appData = JSON.parse(appDataDom.innerText);
    } catch (e) {}
  }
  app.provide('$appData', appData);
  app.mount('#app');
};
