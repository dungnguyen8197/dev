<template>
  <div>
    <div class="com-activity-groups">
      <div class="com-activity-groups__group">
        <div class="com-activity-groups__name">
          <div class="table-auto" v-for="(team, index) in activities" :key="index">
            <a :href="`/organizations/${organizationId}/teams/${team.id}`" class="text-deco-none text-primary">
              <Activity
                :image="`/public/images/activity/icon-activity1.svg`"
                :name="team.name"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import Activity from './Activity.vue';
import { OrganizationTeam } from '../../../types/organization/team';

export default defineComponent({
  components: {Activity},
  props: {
    activities: {
      type: Array as () => OrganizationTeam[],
      required: true,
      default: () => [],
    },
    organizationId: {
      type: [String, Number],
      required: true,
    },
  },
});
</script>

<style lang="scss">
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.com-activity-groups {
  overflow-x: auto;
  white-space: nowrap;
  background-color: var(--light-color);
  padding: 0.3rem;
  &__name {
    text-align: left;
    display: flex;
    min-width: 938px;
    font-size: 12px;
    flex-wrap: wrap;
  }
  &__assist{
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    margin-top: 10px;
    padding: 5px 10px;
    text-align: center;
    justify-content: center;
    align-items: center;
    >li{
      font-size: 12px;
      >div{
        display: flex;
        img{
          margin-right:5px;
        }
      }
      >p{
        margin:0;
      }
      .btn{
        background-color: var(--secondary-color);
        color: #fff;
      }
    }
  }
  &::-webkit-scrollbar {
    width: 2px;
    height: 5px;
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
  
.com-list-activity__link{
  & > a {
    color: var(--secondary-color);
    text-align: center;
    display: block;
  }
}
</style>
