<template>
  <div class="com-ranking-groups">
    <div class="com-ranking-groups__scroll">
      <div
        class="com-ranking-groups__group"
        v-for="(group, index) in states.groups"
        :key="index"
      >
        <div class="com-ranking-groups__name">
          <span class="com-ranking-groups__icon">
            <img :src='group.image' />
          </span>
          <span>{{ group.name }}</span>
        </div>
        <div class="com-ranking-groups__place" :class="'place-' + group.place">
          {{ group.place }}位
        </div>
        <div class="com-ranking-groups__teams">
          {{ group.teams }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "@vue/runtime-core";

export default defineComponent({
  components: {},
  setup(props) {
    const states = reactive({
      groups: [
        {
          icon: "",
          name: "総合",
          place: "100",
          teams: "/ 20,000",
          image:'/public/images/top/icon-ranking-school.svg'
        },
        {
          icon: "",
          name: "総合",
          place: "9",
          teams: "/ 2,000",
          image:'/public/images/top/icon-awesome-school.svg'
        },
        {
          icon: "",
          name: "総合",
          place: "1",
          teams: "/ 200",
          image:'/public/images/top/icon-awesome-school.svg'
        },
        {
          icon: "",
          name: "総合",
          place: "3",
          teams: "/ 100",
          image:'/public/images/top/icon-awesome-running.svg'
        },
        {
          icon: "",
          name: "総合",
          place: "2",
          teams: "/ 20",
          image:'/public/images/top/icon-awesome-running.svg'
        },
          {
          icon: "",
          name: "総合",
          place: "1",
          teams: "/ 10",
          image:'/public/images/top/icon-awesome-school.svg'
        },
      ],
    });
    return { states };
  },
});
</script>

<style lang="scss">
.com-ranking-groups {
  border-bottom: 1px solid rgba(#9d9d9d, 0.24);
  border-top: 1px solid rgba(#9d9d9d, 0.24);
  padding: 12px 0;
  &__scroll {
    overflow-x: auto;
    white-space: nowrap;
    /* width */
    &::-webkit-scrollbar {
      width: 2px;
      height: 2px;
    }

    /* Track */
    &::-webkit-scrollbar-track {
      background: #f1f1f1; 
    }
    
    /* Handle */
    &::-webkit-scrollbar-thumb {
      background: #888; 
    }

    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
      background: #555; 
    }
  }
  &__group {
    width: 100px;
    text-align: center;
    display: inline-block;
    position: relative;
    color: var(--primary-color);
    &:after {
      content: '';
      display: block;
      width: 1px;
      height: 38px;
      position: absolute;
      background: rgba(#9D9D9D, 0.24);
      right: 0;
      top: 50%;
      transform: translate(0, -50%);
    }
    &:last-child:after {
      display: none;
    }
  }
  &__icon {
    margin-right: 5px;
  }
  &__place {
    padding: 10px 0;
    font-size: 16px;
  }
  &__place-text {
    font-size: 12px;
  }
  &__teams {
    font-size: 12px;
  }
}
.place-1 {
  color: var(--place-1-color);
}
.place-2 {
  color: var(--place-2-color);
}
.place-3 {
  color: var(--place-3-color);
}
</style>