<template>
  <div class="com-share-buttons">
    <h4 class="com-share-buttons__title text-normal">部活ページをSNSでシェアしましょう！</h4>
    <div class="com-share-buttons__items">
      <a class="com-share-buttons__item" href="#">
        <img src="/public/images/organizations/icon-share-facebook.svg">
        <div class="com-share-buttons__item-name">Facebook</div>
      </a>
      <a class="com-share-buttons__item" href="#">
        <img src="/public/images/organizations/icon-share-twitter.svg">
        <div class="com-share-buttons__item-name">Twitter</div>
      </a>
      <a class="com-share-buttons__item" href="#">
        <img src="/public/images/organizations/icon-share-line.svg">
        <div class="com-share-buttons__item-name">LINE</div>
      </a>
       <a class="com-share-buttons__item" href="#">
        <img src="/public/images/organizations/icon-share-url.svg">
        <div class="com-share-buttons__item-name">URLをコピー</div>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "@vue/runtime-core";

export default defineComponent({
  components: {},
  setup(props) {
    const states = reactive({
      
    });
    return { states };
  },
});
</script>

<style lang="scss" scope>
.com-share-buttons {
  background: var(--light-color);
  border-radius: 2px;
  padding: 14px 14px 5px;
  &__title {
    text-align: left;
    margin: 0 0 5px 50px;
    font-size: 12px;
  }
  &__items {
    display: flex;
    justify-content: center;
    margin: 15px 30px;
    align-items: center;
  }
  &__item {
    text-decoration: none;
    display: block;
    text-align: center;
    width: 25%;
  }
  &__item-name {
    font-size: 9px;
    text-align: center;
    margin-top: 0px;
    color: var(--primary-color);
  }
}
</style>