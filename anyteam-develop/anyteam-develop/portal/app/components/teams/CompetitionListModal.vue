<template>
  <Modal
    title="部活登録"
    description="登録する部活動を選択してください<br>※一つの競技で複数部活がある場合は、その部活数分登録ください。"
    button-text="次へ"
    @confirm="handleSubmit"
  >
   <div class="competition__wrapper">
      <div class="competition__list">
        <div 
          class="competition__item text-sm" 
          v-for="competition in registerCompetitions" 
          v-bind:key="competition.id"
        >
          <div class="competition__item-name">{{ competition.name }}</div>
          <QuantityButton 
            v-bind:quantity="competition.quantity"
            @increase="increase(competition.id)"
            @decrease="decrease(competition.id)"
          />
        </div>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from "vue-property-decorator";
import Modal from "~/components/common/Modal.vue";
import QuantityButton from "~/components/teams/QuantityButton.vue";
import { CompetitionResponse } from "~/interfaces/response/competitions";
import { RegisterCompetition } from '~/interfaces/competition';

@Component({
  components: {
    Modal,
    QuantityButton,
  }
})
export default class CompetitionListModal extends Vue {
  @Prop({type: Array, default: () => []}) competitions!: CompetitionResponse[];
  registerCompetitions: RegisterCompetition[] = [];

  @Watch('competitions', { immediate: true })
  updateRegisteredCompetitions() {
    this.registerCompetitions = this.competitions.map(competition => {
      return {
        id: competition.id,
        name: competition.name,
        quantity: 0
      }
    });
  }

  increase(id: number) {
    this.registerCompetitions.forEach(competition => {
      if (competition.id === id) {
        competition.quantity++;
      }
    });
  }

  decrease(id: number) {
    this.registerCompetitions.forEach(competition => {
      if (competition.id === id && competition.quantity > 0) {
        competition.quantity--;
      }
    });
  }

  @Emit('confirm')
  submit() {
    return this.registerCompetitions;
  }

  handleSubmit() {
    this.submit();
    this.registerCompetitions.forEach(competition => {
      competition.quantity = 0;
    })
  }
}
</script>

<style lang="scss" scoped>
.competition {
  &__wrapper {
    max-width: 1000px;
    margin: 20px auto 0;
    padding: 0 40px;
  }
  &__list {
    max-height: 30rem;
    @media (min-height: 569px) {
      max-height: 35rem;
    }
    @media (min-height: 852px) {
      max-height: 61rem;
    }
    overflow-y: auto;
    display: flex;
    flex-flow: row wrap;
    margin: 0 -30px;
    & > .competition__item {
      padding: 0 30px;
    }
  }
  &__item {
    flex-grow: 0;
    text-align: left;
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
    @media (min-width: 768px) {
      width: calc(100% / 2);
    }
    @media (min-width: 1200px) {
      width: calc(100% / 3);
    }
    &-name {
      max-width: 160px;
    }
  }
}
</style>