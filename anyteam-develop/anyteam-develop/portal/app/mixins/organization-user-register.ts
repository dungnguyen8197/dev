import Vue from 'vue';
import Component from 'vue-class-component';
import { registerOrganizationUser } from '~/api/organization-user';
import { OrganizationUserRequest } from '~/interfaces/request/organization-user';

@Component
export class OrganizationUserRegisterMixin extends Vue {
  registerDone = false;
  error = false;
  emailError = '';
  userId = this.$auth.user!.id as number;
  routeUserId = +this.$route.params.organization_user_id as number;
  organizationId = this.$auth.user!.organization_id as number;

  async handleSubmit($event: OrganizationUserRequest): Promise<void> {
    if (!this.userId || !this.organizationId) {
      this.error = true;
      return;
    }

    this.error = false;
    this.emailError = '';

    try {
      await registerOrganizationUser(
        this.organizationId,
        isNaN(this.routeUserId)? this.userId : this.routeUserId,
        $event
      );
      this.registerDone = true;
    } catch (e: any) {
      this.error = true;

      if (e.status === 409) {
        this.emailError = e.data.error.email;
      }
    }
  }
}