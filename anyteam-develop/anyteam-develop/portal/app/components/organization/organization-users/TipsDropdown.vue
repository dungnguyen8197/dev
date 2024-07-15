<template>
  <Dropdown
    trigger="hover"
    style="display: inline-block; margin-left: 10px;"
    v-bind:width="230"
    v-bind:is-left-position="true"
  >
    <template #trigger>
      <div class="tips">?</div>
    </template>
    <div class="text-left pr-3">
      <p class="text-xs">管理者<br>- 各情報の追加・編集が可能<br>閲覧者<br>- 各情報の閲覧のみが可能</p>
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
