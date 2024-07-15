import Vue from 'vue';
import Component from 'vue-class-component';
import { updateOrganizationTeams } from "~/api/organizations";
import { OrganizationTeamRequest } from '~/interfaces/request/organization-team';

@Component
export class TeamsRegisterMixin extends Vue {
	showConfirmModal = false;
	showSuccessModal = false;
	teamData: OrganizationTeamRequest[] = [];

	async confirmRegister() {
		try {
			this.showConfirmModal = false;

			await updateOrganizationTeams(
				Number(this.$auth.user?.organization_id),
				this.teamData
			);
			this.showSuccessModal = true;
		} catch {}
	}

	handleSubmit(teamData: OrganizationTeamRequest[]) {
		this.teamData = teamData;
		this.showConfirmModal = true;
	}
}