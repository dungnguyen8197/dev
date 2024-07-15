<template>
  <CForm class="needs-validation" novalidate @submit.prevent="handleSubmit">
    <CCard>
      <CCardHeader class="pt-4 px-4">
        <InputSelect
          label="種別"
          name="type"
          :options="[{ value: 1, label: '学校' }]"
          required
        />
        <InputSelect
          label="区分"
          name="division_type_id"
          v-model="organization.division_type_id"
          :options="orgDivTypes"
          :invalidFeedback="invalidRequired"
          required
        />
        <InputText
          label="組織名"
          name="name"
          v-model="organization.name"
          :invalidFeedback="invalidRequired"
          required
        />
        <InputSelect
          label="名前行"
          name="name_line_id"
          v-model="organization.name_line_id"
          :options="nameLines"
          :invalidFeedback="invalidRequired"
          required
        />
        <InputText
          label="メールアドレス"
          name="email"
          :pattern="EMAIL_REGEX"
          v-model="organization.email"
          :invalidFeedback="invalidEmail"
        />
        <InputSelect
          label="都道府県"
          name="region_id"
          v-model="organization.region_id"
          :options="regions"
          required
        />
        <InputText
          label="市区町村"
          name="municipalities"
          v-model="organization.municipalities"
        />
        <InputText
          label="町名/番地"
          name="address"
          v-model="organization.address"
        />
        <InputText
          label="建物名"
          name="building_name"
          v-model="organization.building_name"
        />
        <InputPhone
          label="電話番号"
          name="telephone_number"
          v-model="organization.telephone_number"
          :isValid="validPhoneNumber"
        />
        <InputText
          label="銀行コード"
          name="bank_code"
          placeholder="例 1234 (数字4桁)"
          pattern="[0-9]{4}"
          v-model="organization.bank_code"
          :invalidFeedback="invalidLength(4)"
        />
        <InputText
          label="支店コード"
          name="branch_code"
          placeholder="例 123 (数字3桁)"
          pattern="[0-9]{3}"
          v-model="organization.branch_code"
          :invalidFeedback="invalidLength(3)"
        />
        <InputSelect
          label="口座種別"
          name="account_type_id"
          v-model="organization.account_type_id"
          :options="accountTypes"
        />
        <InputText
          label="口座番号"
          name="account_number"
          placeholder="例 1234567 (数字7桁)"
          pattern="[0-9]{7}"
          v-model="organization.account_number"
          :invalidFeedback="invalidLength(7)"
        />
        <InputText
          label="口座名義"
          name="account_holder"
          v-model="organization.account_holder"
        />
        <InputImage
          label="組織アイコン"
          name="icon"
          :image-url="iconUrl"
          @change:image="onChangeImage"
        />
        <InputRadio
          label="団体"
          name="is_group"
          v-model="organization.is_group"
          :options="isGroupRadio"
          :invalidFeedback="invalidRequired"
          required
        />
        <InputRadio
          label="ステータス"
          name="status"
          v-model="organization.status"
          :options="statusRadio"
          :invalidFeedback="invalidRequired"
          required
        />
      </CCardHeader>
    </CCard>
    <CButton color="primary" type="submit" size="lg" :disabled="isLoading" class="mb-4">
      <CSpinner
        v-if="isLoading"
        size="sm"
        color="white"
      />
      <span v-else>
        保存
      </span>
    </CButton>
  </CForm>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import InputText from '~/components/form/InputText.vue';
import InputSelect from '~/components/form/InputSelect.vue';
import InputRadio from '~/components/form/InputRadio.vue';
import InputPhone from '~/components/form/InputPhone.vue';
import InputImage from '~/components/form/InputImage.vue';
import { OrganizationDTO } from '~/interfaces/organization.interface';
import { SelectOption } from '~/interfaces/select-option';
import { getRegionGroups } from '~/api/region';
import { getOrganizationDivisionType } from '~/api/organization-division-type';
import { accountTypes } from '~/helpers/account-type';
import { regionResponseToSelectOptions } from '~/helpers/region';
import { nameLines } from '~/helpers/name-line';
import { orgDivTypeResponseToSelectOptions } from '~/helpers/organization-division-type';
import { EMAIL_REGEX, PHONE_REGEX } from '~/constants/regex';
import { invalidRequired, invalidEmail, invalidLength } from '~/constants/messages';


@Component({
  components: {
    InputImage,
    InputPhone,
    InputRadio,
    InputText,
    InputSelect,
  }
})
export default class OrganizationForm extends Vue {
  @Prop(Object) organization!: OrganizationDTO;
  @Prop({ type: Boolean, default: false }) isLoading!: boolean;

  readonly EMAIL_REGEX = EMAIL_REGEX;
  readonly accountTypes = [
    { value: '', label: '未選択' },
    ...accountTypes
  ];
  readonly nameLines = nameLines;
  regions = [] as SelectOption[];
  orgDivTypes = [] as SelectOption[];
  readonly isGroupRadio = [
    { value: 'false', label: 'No' },
    { value: 'true', label: 'Yes' },
  ]
  readonly statusRadio = [
    { value: '0', label: '非公開' },
    { value: '1', label: '公開' },
  ]
  readonly invalidRequired = invalidRequired;
  readonly invalidEmail = invalidEmail;
  iconUrl = '';

  invalidLength = invalidLength;

  async created() {
    try {
      const response = await getRegionGroups();
      this.regions = regionResponseToSelectOptions(response.groups);
    } catch (err) {}

    try {
      const response = await getOrganizationDivisionType(1);
      this.orgDivTypes = orgDivTypeResponseToSelectOptions(response);
    } catch (err) {}

    this.iconUrl = this.organization.icon || '';
  }

  onChangeImage(image: File | null) {
    this.organization.iconBlob = image;
  }

  get validPhoneNumber(): boolean {
    if (!this.organization.telephone_number) {
      return true;
    }
    return !!this.organization.telephone_number.match(new RegExp(PHONE_REGEX));
  }

  @Emit('submit')
  handleSubmit(event: Event): OrganizationDTO | null {
    const form = event.target as HTMLFormElement;
    form.classList.add('was-validated');

    if (form.checkValidity() && this.validPhoneNumber) {
      return this.organization;
    }

    return null;
  }
}
</script>
