<template>
  <form class="form-container">
    <div class="flex justify-end">
      <Button outline @click.native="showCompetitionModal = true">
        <span class="mr-1 icon icon-plus icon-primary"></span>
        <span>部活を追加</span>
      </Button>
    </div>
    <Table class="mt-1">
      <thead>
        <tr>
          <th width="20%" class="pl-1">競技</th>
          <th width="42%">部活名</th>
          <th width="18%" class="center">アクション</th>
          <th width="15%" class="text-right pr-1.5">
            ステータス
            <TipsDropdown />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="team in registerTeams"
          :key="team.uuid"
        >
          <td class="pl-1">{{ getCompetitionNameByTeamUuid(team.uuid) }}</td>
          <td>{{ team.name }}</td>
          <td class="center">
            <Button
              size="sm"
              style="color: var(--dark-blue); background-color: var(--light-gray); border: none; height: 28px"
              @click.native="editTeam(team.uuid)"
            >
              <img src="/icons/teams/pencil.svg" alt="pencil" class="mr-1"/>
              <span>編集</span>
            </Button>
          </td>
          <td class="pr-1.5 text-right">
            <ToggleSwitch
              v-bind:checked="!!team.status"
              v-bind:label="team.status === TEAM_STATUS_ACTIVE ? '公開' : '非公開'"
              @change="onChangeStatus($event, team.uuid)"
            />
          </td>
        </tr>
      </tbody>
    </Table>
    <SubmitButton
      class="my-6"
      v-bind:active="enableSubmitButton"
      v-bind:label="buttonText"
      v-bind:handleClick="handleSubmit"
      v-if="registerTeams.length > 0"
    />
    <CompetitionListModal
      v-show="showCompetitionModal && competitions.length > 0"
      v-bind:competitions="competitions"
      @confirm="addTeams"
    />
    <TeamUpdateModal
      v-show="showUpdateModal"
      v-bind:competitions="competitions"
      v-bind:team="editingTeam"
      @close="showUpdateModal = false"
      @confirm="updateTeam"
      @remove="removeTeam"
    />
    <Modal
      v-show="showRemoveSuccessModal"
      title="削除が完了しました"
      button-text="戻る"
      @confirm="showRemoveSuccessModal = false"
    />
    <StatusChangeModal
      v-show="showStatusChangeModal"
      @close="showStatusChangeModal = false"
    />
    <Modal
      v-show="showErrorModal"
      title="エラー"
      button-text="戻る"
      @confirm="showErrorModal = false"
    >
      <div class="text-xs text-left" style="width: 255px;">
        <p>
          同一の部活名が存在しています。
          <br>
          一競技に複数部活が存在する場合は、その部活数分部活名を登録ください。
        </p>
        <div class="my-1">
          <p class="my-0">例 ) 男子公式テニス部</p>
          <p class="my-0 ml-2">女子軟式テニス部 など</p>
        </div>
      </div>
    </Modal>
  </form>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from "vue-property-decorator";
import { v4 as uuidv4 } from 'uuid';
import Button from "~/components/common/Button.vue";
import Table from "~/components/common/Table.vue";
import SubmitButton from "~/components/form/SubmitButton.vue";
import ToggleSwitch from '~/components/form/ToggleSwitch.vue';
import CompetitionListModal from "~/components/teams/CompetitionListModal.vue";
import StatusChangeModal from "~/components/teams/StatusChangeModal.vue";
import TipsDropdown from "~/components/teams/TipsDropdown.vue";
import TeamUpdateModal from "~/components/teams/TeamUpdateModal.vue";
import Modal from "~/components/common/Modal.vue";
import { getOrganizationTeams } from "~/api/organizations";
import { getCompetitions } from "~/api/competitions";
import { CompetitionResponse } from "~/interfaces/response/competitions";
import { RegisterCompetition } from '~/interfaces/competition';
import { RegisterTeam, UpdateTeam } from '~/interfaces/team';
import { OrganizationTeamRequest } from '~/interfaces/request/organization-team';

@Component({
  components: {
    SubmitButton,
    Table,
    Button,
    CompetitionListModal,
    StatusChangeModal,
    ToggleSwitch,
    TipsDropdown,
    TeamUpdateModal,
    Modal,
  },
})
export default class TeamsForm extends Vue {
  @Prop({ type: String, default: "保存" }) buttonText!: string;
  @Prop({ type: Boolean, default: false }) isInitial!: boolean;

  competitions: CompetitionResponse[] = [];
  registerTeams: RegisterTeam[] = [];
  editingTeamUuid = null as string | null;
  showCompetitionModal = this.isInitial;
  enableSubmitButton = false;
  showUpdateModal = false;
  showRemoveSuccessModal = false;
  showStatusChangeModal = false;
  showErrorModal = false;
  readonly TEAM_STATUS_DEACTIVE = 0;
  readonly TEAM_STATUS_ACTIVE = 1;

  get editingTeam() {
    return this.registerTeams.find(team => team.uuid === this.editingTeamUuid) || {
      uuid: '',
      name: '',
      competition_id: 1,
      status: this.TEAM_STATUS_ACTIVE,
    };
  }

  async mounted(): Promise<void> {
    try {
      const organization_id = this.$auth.user!.organization_id as number;
      const teams = await getOrganizationTeams(
        organization_id,
        { scope: "all" }
      );
      const competitions = await getCompetitions();

      this.registerTeams = teams.list.map(team => ({
        uuid: uuidv4(),
        id: team.id,
        name: team.name,
        status: team.status,
        competition_id: team.competition_id,
      }))
      this.competitions = competitions.list;
    } catch {}
  }

  addTeams(registerCompetitions: RegisterCompetition[]) {
    this.showCompetitionModal = false;
    registerCompetitions.forEach(competition => {
      for (let i = 0; i < competition.quantity; i++) {
        this.registerTeams.push({
          uuid: uuidv4(),
          name: '',
          status: 1,
          competition_id: competition.id,
        });
      }
    });
    if (this.registerTeams.length > 0) {
      this.enableSubmitButton = true;
    }
  }

  onChangeStatus(status: boolean, teamUuid: string) {
    const team = this.registerTeams.find(team => team.uuid === teamUuid);
    if (team) {
      team.status = status ? this.TEAM_STATUS_ACTIVE : this.TEAM_STATUS_DEACTIVE;
    }
    this.enableSubmitButton = true;
    if (!status) this.showStatusChangeModal = true;
  }

  editTeam(teamUuid: string) {
    this.editingTeamUuid = teamUuid;
    this.showUpdateModal = true;
  }

  updateTeam($event: UpdateTeam) {
    this.registerTeams.forEach(team => {
      if (team.uuid === this.editingTeamUuid) {
        team.name = $event.name;
        team.competition_id = +$event.competition_id;
      }
    });
    this.showUpdateModal = false;
    this.editingTeamUuid = null;
    this.enableSubmitButton = true;
  }

  removeTeam() {
    this.registerTeams = this.registerTeams.filter(team => team.uuid !== this.editingTeamUuid);
    this.showRemoveSuccessModal = true;
    this.editingTeamUuid = null;
  }

  getCompetitionNameByTeamUuid(uuid: string) {
    const team = this.registerTeams.find(team => team.uuid === uuid);
    if (!team) return '';
    const competition = this.competitions.find(competition => competition.id === team.competition_id);
    if (!competition) return '';

    return competition.name;
  }

  validateDuplicateTeamName(): boolean {
    const teamNames: string[] = this.registerTeams.map(team => team.name);

    return !teamNames.some((name, index, array) => {
      return array.indexOf(name) !== index;
    });
  }

  validateEmptyTeamName() {
    return !this.registerTeams.some(team => team.name === '');
  }

  get validate() {
    return this.validateDuplicateTeamName() && this.validateEmptyTeamName();
  }

  @Emit('submit')
  submit(): OrganizationTeamRequest[] {
    return this.registerTeams.map((team) => ({
      id: team.id,
      name: team.name,
      status: team.status,
      competition_id: team.competition_id,
    }));
  }

  handleSubmit(): void {
    if (!this.validate) {
      this.showErrorModal = true;
      return;
    }

    this.submit();
  }
}
</script>
