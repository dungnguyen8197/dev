<template>
  <Dropdown
    trigger="hover"
    style="display: inline-block; margin-left: 10px;"
    v-bind:width="264"
  >
    <template #trigger>
      <div class="tips">?</div>
    </template>
    <div class="text-left pr-3">
      <h4 class="text-md my-0">ステータス</h4>
      <p class="text-xs">公開ステータスにするとANYTEAM上で部活ページが立ち上げられ、支援を開始することができます。部活登録後に非公開にすることも可能です。</p>
    </div>
  </Dropdown>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Dropdown from '~/components/common/Dropdown.vue';

@Component({
  components: {
    Dropdown,
  },
})
export default class TipsDropdown extends Vue {}
</script>

<style lang="scss" scoped>
.tips {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #D8D8D8;
  width: 16px;
  height: 16px;
  border-radius: 16px;
  color: var(--white);
  font-size: 11px;
}
</style>
