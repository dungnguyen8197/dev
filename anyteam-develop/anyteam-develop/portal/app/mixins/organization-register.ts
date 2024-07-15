import Vue from 'vue';
import Component from 'vue-class-component';
import { registerOrganization } from '~/api/organizations';
import { getOrganizationById } from '~/api/organizations';
import { OrganizationResponse } from '~/interfaces/response/organization';

@Component
export class OrganizationRegisterMixin extends Vue {
  submitDone = false;
  organization_id = this.$auth.user?.organization_id as number;
  error = false;
  organization = {} as OrganizationResponse;

  async fetchOrganization(): Promise<void> {
    try {
      this.organization = await getOrganizationById(this.organization_id);
    } catch (e) {}  
  }

  async created(): Promise<void> {
    await this.fetchOrganization();
  }

  async handleSubmit($event: FormData): Promise<void> {
    this.error = false;
    try {
      await registerOrganization(this.organization_id, $event);
      this.submitDone = true;
    } catch (e) {
      this.error = true;
    }
  }
}