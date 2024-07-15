<template>
  <Modal
    button-text="閉じる" 
    close-on-backdrop
    @confirm="close"
    @close="close"
  >
    <div class="text-xs text-left my-2">
      非公開にするとANYTEAM上で非表示になり、支援受付が
      <br>
      停止されます。なお、定期支援中の支援者がいる場合は、次
      <br>
      回決済日から支援が自動停止されます。
    </div>
  </Modal>
</template>

<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import Modal from '~/components/common/Modal.vue';

@Component({
  components: {
    Modal,
  }
})
export default class StatusChangeModal extends Vue {
  @Emit('close')
  close() {}
}
</script>
