<template>
  <div>
    <Header title="学校情報" />
    <div>
      <p class="text-2xl">{{ organization.name }}</p>
      <InfoItem title="住所" underline>
        {{ address }}
      </InfoItem>
      <InfoItem title="電話番号" underline>
        {{ organization.telephone_number }}
      </InfoItem>
      <InfoItem title="銀行口座" underline>
        <div class="flex flex-wrap align-items-baseline">
          <div v-if="financial.institution_name" class="mr-2">{{ financial.institution_name }}</div>
          <div v-if="financial.detail" class="mr-2">{{ financial.detail }}</div>
          <div v-if="financial.holder" class="mr-2">{{ financial.holder }}</div>
        </div>
      </InfoItem>
      <InfoItem title="学校アイコン">
        <img 
          class="school-info__img"
          alt="organization icon"
          v-if="organization.icon"
          v-bind:src="organization.icon"
        >
      </InfoItem>
      <div class="flex justify-center">
        <Button
          class="my-6" size="lg"
          @click.native="toEditPage"
        >
          編集
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Header from "~/components/Header.vue";
import Button from "~/components/common/Button.vue";
import InfoItem from "~/components/school/SchoolInfoItem.vue";
import { OrganizationResponse } from '~/interfaces/response/organization';
import { getOrganizationById } from '~/api/organizations';
import { getAccountTypeById } from '~/helpers/account_types';

export default Vue.extend({
  components: { InfoItem, Button, Header },
  head() {
    return {
      title: '学校情報',
    };
  },
  data() {
    return {
      organization: {} as OrganizationResponse,
      account_type_name: '',
    }
  },
  computed: {
    address(): string {
      return this.organization.postal_code + ' ' +
        this.organization.region_name +
        this.organization.municipalities + 
        this.organization.address + 
        this.organization.building_name;
    },
    financial(): { institution_name: string, detail: string, holder: string } {
      return {
        institution_name: this.organization.financial_institution?.name || '',
        detail: this.organization.financial_institution?.shop_name + 
          this.account_type_name + 
          this.organization.account_number,
        holder: this.organization.account_holder,
      }
    }
  },
  methods: {
    toEditPage(): void {
      this.$router.push({ 
        name: 'organizations-organization_id-edit',
        params: { organization_id: this.$route.params.organization_id }
      });
    }
  },
  async created(): Promise<void> {
    try {
      const organizationId = +this.$route.params.organization_id;
      this.organization = await getOrganizationById(organizationId);
      this.account_type_name = getAccountTypeById(this.organization.account_type_id);
    } catch (e: any) {
      this.$nuxt.error({statusCode: e.data.statusCode, message: e.data.message});
    }
  }
});
</script>

<style lang="scss" scoped>
.school-info {
  &__line {
    margin: 1rem 0;
    &:first-child {
      margin-top: 0;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }

  &__img {
    width: 8rem;
    height: 8rem;
    object-fit: cover;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  }
}
</style>
