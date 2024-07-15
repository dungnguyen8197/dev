<template>
  <Modal
    button-text="登録"
    cancel
    @close="close"
    @confirm="confirm"
  >
    <form class="form-container" @submit.prevent="confirm">
      <InputSelect
        label="競技"
        v-bind:value="competitionId"
        is-vertical
        @handleInput="competitionId = $event"
      >
        <option
          v-for="competition in competitions"
          v-bind:key="competition.id"
          v-bind:value="competition.id"
        >
          {{ competition.name }}
        </option>
      </InputSelect>
      <InputText
        ref="teamNameInput"
        label="部活名 ※学校名は記入しないでください"
        v-bind:value="name"
        is-vertical
        @handleInput="name = $event.value"
      />
    </form>
    <template v-if="!team.id" #footer>
      <Divider class="my-1"/>
      <div class="text-sm cursor-pointer" @click="remove">
        削除する
      </div>
    </template>
  </Modal>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch, Ref } from "vue-property-decorator";
import Modal from "~/components/common/Modal.vue";
import InputSelect from "~/components/form/InputSelect.vue";
import InputText from "~/components/form/InputText.vue";
import Divider from "~/components/common/Divider.vue";
import { CompetitionResponse } from "~/interfaces/response/competitions";
import { UpdateTeam } from '~/interfaces/team';

@Component({
  components: {
    Modal,
    InputSelect,
    InputText,
    Divider,
  },
})
export default class TeamUpdateModal extends Vue {
  @Prop({type: Array, default: () => []}) competitions!: CompetitionResponse[];
  @Prop({type: Object, default: () => ({})}) team!: UpdateTeam;

  name: string = '';
  competitionId: number = 0;

  @Ref("teamNameInput") teamNameInput!: InputText;

  updated() {
    (this.teamNameInput.$refs.input as HTMLInputElement).focus();
  }

  @Watch('team', { immediate: true })
  updateTeam() {
    this.name = this.team.name;
    this.competitionId = this.team.competition_id;
  }

  @Emit('close')
  close() {}

  @Emit('confirm')
  confirm(): UpdateTeam {
    return {
      name: this.name.trim() || '',
      competition_id: Number(this.competitionId),
    };
  }

  @Emit('remove')
  remove() {
    this.close();
  }
}
</script>
