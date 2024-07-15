import { createApp } from 'vue';
import InternalServerError from '../pages/InternalServerError.vue';

window.addEventListener('DOMContentLoaded', () => {
  createApp(InternalServerError).mount('#app')
});
