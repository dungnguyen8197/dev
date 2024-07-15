<template>
  <div>
    <PageHeader
      title="マイランキング"
      background="/public/images/user/img-header-user.png"
    ></PageHeader>
    <div>
      <div class="com-user-ranking mt-30">
        <div
          class="com-user-ranking__group"
          v-for="(group, index) in groups"
          :key="index"
        >
          <h3 class="com-user-ranking__group-title">
            <span class="com-user-ranking__group-title-icon"
              ><img :src="group.icon"
            /></span>
            <span class="com-user-ranking__group-title-text">{{
              group.name
            }}</span>
          </h3>
          <ul class="com-user-ranking__items">
            <li
              class="com-user-ranking__item"
              v-for="(item, itemIndex) in group.items"
              :key="itemIndex"
            >
              <div class="com-user-ranking__item-title">{{ item.title }}</div>
              <div class="com-user-ranking__item-rank">
                <div :class="'rank-' + item.rank">
                  {{ item.rank }}<small>位</small>
                </div>
                <div>
                  <small>/ {{ item.total }}人</small>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import PageHeader from "../../components/common/page/PageHeader.vue";

interface ItemInterface {
  title: string,
  rank: string,
  total: string,
}

interface GroupInterface {
  icon: string,
  name: string,
  items: ItemInterface[]
}

export default defineComponent({
  components: {
    PageHeader,
  },
  setup() {
    const groups: GroupInterface[] = [
      {
        icon: "/public/images/common/icon-ranking-team.svg",
        name: "総合ランキング",
        items: [
          {
            title: "全国",
            rank: "10,000",
            total: "10,000,000",
          },
        ],
      },
      {
        icon: "/public/images/common/icon-ranking-connect.svg",
        name: "チーム内ランキング",
        items: [
          {
            title: "運動大学サッカー部",
            rank: "2",
            total: "20",
          },
          {
            title: "運動高校アメリカンフットボール部",
            rank: "1",
            total: "10",
          },
        ],
      },
      {
        icon: "/public/images/common/icon-ranking-school.svg",
        name: "学校内ランキング",
        items: [
          {
            title: "運動大学",
            rank: "5",
            total: "100",
          },
          {
            title: "運動高校",
            rank: "7",
            total: "100",
          },
        ],
      },
    ];
    return { groups };
  },
});
</script>
<style lang="scss" scoped>
.com-user-ranking {
  &__group {
    margin-top: 15px;
  }
  &__group-title {
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    margin: 0;
    padding: 6px 16px;
    &-icon {
      margin-right: 5px;
    }
  }
  &__items {
    list-style: none;
    margin: auto;
    padding: 0;
  }
  &__item {
    border-top: 1px solid var(--light-color);
    position: relative;
    padding: 15px 42px 15px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &:last-child {
      border-bottom: 1px solid var(--light-color);
    }
    &:after {
      content: "";
      position: absolute;
      background: url(/public/images/common/icon-arrow-right.svg);
      width: 12px;
      height: 10px;
      right: 16px;
      background-repeat: no-repeat;
    }

    &-title {
      font-size: 1rem;
      flex: 0 0 50%;
    }

    &-rank {
      font-size: 1.6rem;
      line-height: 1em;
      text-align: center;
      small {
        font-size: 1rem;
      }
      .rank-1 {
        color: var(--place-1-color);
      }
      .rank-2 {
        color: var(--place-2-color);
      }
      .rank-3 {
        color: var(--place-3-color);
      }
    }
  }
}
</style>

