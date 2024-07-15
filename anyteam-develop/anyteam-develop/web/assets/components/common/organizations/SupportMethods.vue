<template>
  <div class="com-support-methods">
    <ul class="com-support-methods__items">
      <li
        class="com-support-methods__item"
        v-for="(method, index) in states.methods"
        :key="index"
      >
        <div class="com-support-methods__item-inner">
          <div class="com-support-methods__icon">
            <img
              :src="'/public/images/organizations/' + method.icon"
              :alt="method.name"
            />
          </div>
          <div class="com-support-methods__name">{{ method.name }}</div>
          <div class="com-support-methods__desc" v-html="method.desc"></div>
          <div class="com-support-methods__money" v-html="method.money"></div>
        </div>
      </li>
    </ul>
    <div class="text-center mt-16">
      <button class="btn btn-secondary btn-wide">チームを支援する</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "@vue/runtime-core";

export default defineComponent({
  components: {},
  setup(props) {
    const states = reactive({
      methods: [
        {
          icon: "icon-support-method-normal.svg",
          name: "通常支援",
          desc: "応援したいチームへの支援を、<br>ご指定の金額で「1回」行います。",
          money:
            '1,000<span class="com-support-methods__money-text">円〜</span>',
        },
        {
          icon: "icon-support-method-regular.svg",
          name: "定期支援",
          desc: "応援したいチームへの支援を、<br>ご指定の金額で「毎月（合計12回）」行います。",
          money:
            '500<span class="com-support-methods__money-text">円〜/月</span>',
        },
      ],
    });
    return { states };
  },
});
</script>

<style lang="scss" scope>
.com-support-methods {
  &__items {
    list-style: none;
    margin: auto;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
  }
  &__item {
    color: var(--primary-color);
    width: 50%;
  }
  &__item-inner {
    border: 1px solid var(--border-gray);
    border-radius: 4px;
    margin: 4px;
    padding: 10px;
    text-align: center;
    min-height: 100%;
    height: 100%;
  }
  &__name {
    font-size: 16px;
    margin-top: 5px;
  }
  &__desc {
    font-size: 8px;
    min-height: 40px;
  }
  &__money {
    margin-top: 9px;
    font-size: 12px;
    color: var(--secondary-color);
  }
  &__money-text {
    font-size: 10px;
  }
}
</style>