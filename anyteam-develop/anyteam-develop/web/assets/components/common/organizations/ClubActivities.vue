<template>
  <div class="com-club-activities">
    <ul class="com-club-activities__items">
      <li
        class="com-club-activities__item"
        v-for="(item, index) in list"
        :key="index"
      >
        <a :href="`/organizations/${organizationId}/teams/${item.id}`" class="text-deco-none text-primary">
          <div class="com-club-activities__item-inner">
            <div class="com-club-activities__icon">
              <img
                src="/public/images/organizations/icon-team-table.svg"
                :alt="item.name"
              />
            </div>
            <div class="com-club-activities__name">{{ item.name }}</div>
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import { ClubActivitiesObject } from '../../../types/organization';

export default defineComponent({
  props: {
    organizationId: { 
      type: Number,
      required: true
    },
    list: {
      type: Array as () => Array<ClubActivitiesObject>,
      default: [],
    },
  },
  setup(props) {
    return {};
  },
});
</script>

<style lang="scss" scope>
.com-club-activities {
  background: var(--light-color);
  border-radius: 4px;
  padding: 4px;
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  &__items {
    display: flex;
    flex-wrap: wrap;
  }
  &__item {
    width: 33.33%;
  }
  &__item-inner {
    margin: 4px;
    background: #fff;
    height: 56px;
    display: flex;
    display: flex;
    align-items: center;
  }
  &__icon {
    flex: 0 0 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      max-width: 20px;
      width: 100%;
      height: auto;
    }
  }
  &__name {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    font-size: 8px;
    padding: 0 10px 0 0;
    text-align: center;
  }
  @media screen and (min-width: 768px) {
    &__item {
      width: 25%;
    }
  }
}
</style>
