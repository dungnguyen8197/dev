<template>
  <div class="section" id="search">
    <div class="section__header">
      <h3 class="text-normal">部活を探す</h3> 
      <p class="pc-tablet-only">全国からあなたが支援したい部活を探しましょう</p>
    </div>
    <div class="section__body">
      <div class="section__map">
        <Map :region_id="states.region" class="sp-only"/>
        <MapPC :region_id="states.region" class="pc-tablet-only"/>
        <div class="section__regions pc-tablet-only" v-if="states.regionName">
          <div class="section__region-group-name">
            {{ states.regionName }}
          </div>
          <div class="section__region-name-list">
            <div 
              class="section__region-name"
              v-for="prefecture in states.prefectures" 
              @click="updateState('prefecture', 2, { prefecture: prefecture.id })">
              {{ prefecture.name }}
            </div>
          </div>
        </div>
      </div>
      <div class="section__form">
        <div id="step-1" class="section__form-select">
          <Region @updateValue="updateState('region', 1, $event)"/>
        </div>
        <div id="step-2" class="section__form-select" v-if="states.step > 1">
          <Prefecture 
            :value="states.prefecture" 
            :prefectures="states.prefectures"
            @updateValue="updateState('prefecture', 2, $event)"
          />
        </div>
        <div id="step-3" class="section__form-select" v-show="states.step > 2">
          <SchoolTypes @updateValue="updateState('schoolType', 3, $event)"/>
        </div>
        <div id="step-4" class="section__form-select" v-if="states.step > 3">
          <School :region_id="states.prefecture" :school_type="states.schoolType" @updateValue="updateState('school', 4, $event)"/>
        </div>
        <div class="mt-12 text-center" v-if="states.step > 3">
          <button class="btn btn-wide" :class="states.school ? 'btn-secondary' : 'btn-dark-gray'" @click="toSchoolPage">
            次へ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from '@vue/runtime-core';
import Map from './Map.vue';
import MapPC from './MapPC.vue';
import Region from './Region.vue';
import Prefecture from './Prefecture.vue';
import SchoolTypes from './SchoolTypes.vue';
import School from './School.vue';
interface States {
  region: number,
  regionName: string,
  prefecture: number,
  schoolType: number,
  school: number,
  step: number,
  prefectures: Prefecture[],
}
interface Prefecture {
  id: number,
  name: string
}
interface RegionList {
  region: number,
  prefectures: Prefecture[]
}
export default defineComponent({
  components: { Map, MapPC, Region, Prefecture, SchoolTypes, School },
  setup(props) {
    const states: any = reactive<States>({
      region: 0,
      regionName: '',
      prefecture: 0,
      schoolType: 0,
      school: 0,
      step: 1,
      prefectures: [],
    });
    const updateState = (name: string, step: number, value: any) : void => {
      switch (name) {
        case 'region':
          states.region = value.region;
          states.regionName = value.regionName;
          states.prefectures = value.prefectures;
          break;
        case 'prefecture':
          states.prefecture = value.prefecture;
          break;
        case 'schoolType':
          states.schoolType = value.schoolType;
          break;
        case 'school':
          states.school = value.school_id;
          break;
        default:
          break;
      }
      
      if (value) {
        // show next step
        if (value.prefecture > 0 || value.region > 0 || value > 0 || value.schoolType >= 0) {
          states.step = step + 1;
        } else {
          states.step = step;
        }
        // animation: move to step block
        let stepBlock: any = document.getElementById("step-" + (states.step - 1));
        if (stepBlock) {
          stepBlock.scrollIntoView();
        }
      }
    }
    const toSchoolPage = () : void => {
      if (!states.school) return;
      window.location.href = "/organizations/" + states.school;
    }
    return {
      states,
      updateState,
      toSchoolPage,
    }
  }
})
</script>

<style lang="scss" scoped>
.section {
  &__body {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &__map {
    max-width: 500px;
  }
  &__form {
    width: 100%;
    max-width: 344px;
    margin-top: 24px;
    padding-bottom: 24px;
    &-select {
      margin-bottom: 12px;
    }
    &-select:deep(.card) {
      .card__title {
        text-align: center;
      }
    }
  }
  @media screen and (min-width: 768px) {
    &__body {
      flex-direction: row-reverse;
      justify-content: space-between;
      align-items: flex-start;
    }
    &__map {
      width: 600px;
      margin-left: 24px;
      position: relative;
      padding-bottom: 100px;
    }
    &__form {
      margin-top: 0;
      background-color: var(--white-color);
      border-radius: 4px;
      box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
      overflow: hidden;
      &-select:deep(.card) {
        background-color: var(--white-color);
        .card__title {
          text-align: left;
        }
        .card__body {
          .form-select,
          button {
            background-color: var(--light-color);
          }
          button.btn-secondary {
            background-color: var(--secondary-color);
          }
        }
      }
    }
    &__regions {
      position: absolute;
      top: 60%;
      left: 30%;
      width: 300px;
    }
    &__region-group-name {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 18px;
      color: var(--white-color);
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background-color: var(--primary-color);
    }
    &__region-name {
      font-size: 15px;
      text-decoration: underline;
      width: 7rem;
      cursor: pointer;
    }
    &__region-name-list {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      margin: 18px 0 24px 18px;
    }
  }
}
</style>