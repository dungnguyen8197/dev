<template>
  <form class="form-container" id="organization-form">
    <div v-if="error" class="form__error">{{ errorText }}</div>
    <Divider />
    <InputText
      class="px-2 px-md-6"
      label="メールアドレス"
      labelBadge="必須"
      inputId="email"
      inputName="email"
      placeholder="未記入"
      v-on:handleInput="setEmail"
      v-bind:value="organization.email"
      v-bind:validateRule="{email: true, required: true}"
    />
    <Divider />
    <InputGroup label="住所" labelBadge="必須" class="px-2 px-md-6">
      <div class="flex my-1 align-items-start postal-group">
        <InputPostalCode 
          label="郵便番号" 
          labelWidth="7rem" 
          v-bind:value="organization.postal_code"
          v-bind:style="{ marginBottom: 0, marginTop: 0 }"
          @handleInput="setPostalCode"
        />
        <Button
          color="dark-blue" style="height: 42px"
          @click.native="autofillAddress"
        >住所検索</Button>
      </div>
      <InputSelect
        labelWidth="7rem"
        inputWidth="14rem"
        label="都道府県"
        inputName="region_id"
        defaultOption="未選択"
        v-on:handleInput="setRegionId"
        v-bind:value="organization.region_id"
      >
        <option
          v-for="region in regions"
          v-bind:key="region.id"
          v-bind:value="region.id"
        >
          {{ region.name }}
        </option>
      </InputSelect>
      <InputText
        labelWidth="7rem"
        label="市区町村"
        placeholder="未記入"
        inputName="municipalities"
        v-on:handleInput="setMunicipalities"
        v-bind:value="organization.municipalities"
        v-bind:validateRule="{required: true}"
      />
      <InputText
        labelWidth="7rem"
        label="町名/番地"
        placeholder="未記入"
        inputName="address"
        v-on:handleInput="setAddress"
        v-bind:value="organization.address"
        v-bind:validateRule="{required: true}"
      />
      <InputText
        labelWidth="7rem"
        label="建物名"
        placeholder="未記入"
        inputName="building_name"
        v-on:handleInput="setBuildingName"
        v-bind:value="organization.building_name"
        v-bind:validateRule="{required: true}"
      />
    </InputGroup>
    <Divider />
    <InputPhone
      class="px-2 px-md-6"
      label="電話番号"
      labelBadge="必須"
      v-bind:value="organization.telephone_number"
      @handleInput="setTelephoneNumber"
    />
    <Divider />
    <InputGroup label="銀行口座" labelBadge="必須" class="px-2 px-md-6">
      <div class="bank-input__wrapper">
        <InputText
          class="bank-input__code"
          labelWidth="7rem"
          inputWidth="14rem"
          label="銀行コード"
          placeholder="例 1234 (数字4桁)"
          inputName="bank_code"
          v-on:handleInput="setBankCode"
          v-bind:value="organization.bank_code"
          v-bind:validateRule="{length: 4, number: true}"
        />
        <InputText
          class="bank-input__name"
          labelWidth="7rem"
          label="銀行名"
          v-bind:value="financial.bank_name"
          readonly
        />
      </div>
      <div class="bank-input__wrapper">
        <InputText
          class="bank-input__code"
          labelWidth="7rem"
          inputWidth="14rem"
          label="支店コード"
          placeholder="例 123 (数字3桁)"
          inputName="branch_code"
          v-on:handleInput="setBranchCode"
          v-bind:value="organization.branch_code"
          v-bind:validateRule="{length: 3, number: true}"
        />
        <InputText
          class="bank-input__name"
          labelWidth="7rem"
          label="支店名"
          v-bind:value="financial.branch_name"
          readonly
        />
      </div>
      <InputSelect
        labelWidth="7rem"
        inputWidth="14rem"
        label="口座種別"
        inputName="account_type_id"
        defaultOption="未選択"
        v-on:handleInput="setAccountTypeId"
        v-bind:value="organization.account_type_id"
      >
        <option
          v-for="accountType in accountTypes"
          v-bind:key="accountType.id"
          v-bind:value="accountType.id"
        >
          {{ accountType.name }}
        </option>
      </InputSelect>
      <InputText
        labelWidth="7rem"
        label="口座番号"
        placeholder="例 1234567 (数字7桁)"
        description="口座番号が7桁以下の場合は先頭に0をつけてください"
        inputName="account_number"
        v-on:handleInput="setAccountNumber"
        v-bind:value="organization.account_number"
        v-bind:validateRule="{length: 7, number: true}"
      />
      <InputText
        labelWidth="7rem"
        label="口座名義"
        placeholder="例 ヤマダタロウ"
        inputName="account_holder"
        v-on:handleInput="setAccountHolder"
        v-bind:value="organization.account_holder"
        v-bind:validateRule="{required: true}"
      />
    </InputGroup>
    <Divider />
    <InputImage
      class="px-2 px-md-6"
      label="学校アイコン"
      title="画像をアップロードする"
      subtitle="縦横比200px_200px以上の画像推奨"
      v-bind:preview="organization.icon"
      v-on:handleInput="setIcon"
    />
    <Divider />
    <SubmitButton
      class="my-6"
      v-bind:label="buttonText"
      v-bind:handleClick="submit"
      v-bind:active="canSubmit"
    />
  </form>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
import Divider from '~/components/common/Divider.vue';
import InputText from '~/components/form/InputText.vue';
import InputGroup from '~/components/form/InputGroup.vue';
import InputSelect from '~/components/form/InputSelect.vue';
import InputPhone from '~/components/form/InputPhone.vue';
import InputImage from '~/components/form/InputImage.vue';
import InputPostalCode from '~/components/form/InputPostalCode.vue';
import Button from '~/components/common/Button.vue';
import SubmitButton from '~/components/form/SubmitButton.vue';
import { Region } from '~/interfaces/response/region';
import { OrganizationResponse } from '~/interfaces/response/organization';
import { getRegionGroups } from '~/api/regions';
import { getOrganizationById } from '~/api/organizations';
import { getRegionsFromGroups } from '~/helpers/regions';
import { accountTypes } from '~/helpers/account_types';
import { InputTextEmit } from '~/interfaces/input-emit';
import { getAddressByPostalCode } from '~/api/postal-code';
import { getFinancialName } from '~/api/financial';

@Component({
  components: {
    SubmitButton,
    InputImage,
    InputPhone,
    InputSelect,
    InputGroup,
    InputText,
    InputPostalCode,
    Button,
    Divider,
  },
})
export default class OrganizationForm extends Vue {
  @Prop(String) errorText: string | undefined;
  @Prop({ type: Boolean, default: false }) error: boolean | undefined;
  @Prop({ type: String, default: '登録' }) buttonText!: string;
  @Prop(Number) organizationId!: number;

  canSubmit: boolean = false;
  organization = {
    id: this.organizationId,
    name: '',
    email: '',
    region_id: 0,
    region_name: '',
    municipalities: '',
    address: '',
    building_name: '',
    telephone_number: '',
    bank_code: '',
    branch_code: '',
    account_type_id: 0,
    account_number: '',
    account_holder: '',
    icon: '',
  } as OrganizationResponse;
  isValid = {
    email: false,
    postal_code: false,
    municipalities: false,
    address: false,
    building_name: false,
    bank_code: false,
    branch_code: false,
    account_number: false,
    account_holder: false,
    account_type_id: false,
    telephone_number: false,
    icon: false,
  }
  icon: File | undefined = undefined;
  regions: Region[] = [];
  accountTypes = accountTypes;
  financial = {
    bank_name: '',
    branch_name: '',
  }

  @Emit('submit')
  submit(): FormData {
    const form = document.getElementById('organization-form') as HTMLFormElement;
    const formData = new FormData(form);
    formData.append('telephone_number', this.organization.telephone_number);
    formData.append('postal_code', this.organization.postal_code);

    if (this.icon) {
      formData.append('icon', this.icon);
    }

    return formData;
  }

  async mounted() {
    try {
      const response = await getRegionGroups();
      this.regions = getRegionsFromGroups(response.groups);
    } catch (e: any) {
      this.$nuxt.error({ statusCode: e.data.statusCode, message: e.data.message });
    }

    try {
      const organization = await getOrganizationById(this.organizationId);
      this.organization = {
        id: this.organizationId,
        name: organization.name || '',
        email: organization.email || '',
        postal_code: organization.postal_code || '',
        region_id: organization.region_id,
        region_name: organization.region_name || '',
        municipalities: organization.municipalities || '',
        address: organization.address || '',
        building_name: organization.building_name || '',
        telephone_number: organization.telephone_number || '',
        bank_code: organization.bank_code || '',
        branch_code: organization.branch_code || '',
        account_type_id: organization.account_type_id || 1,
        account_number: organization.account_number || '',
        account_holder: organization.account_holder || '',
        icon: organization.icon || '',
        status: organization.status || 0,
      }
      await this.autofillFinancialName();
    } catch (e: any) {
      this.$nuxt.error({ statusCode: e.data.statusCode, message: e.data.message });
    }
  }

  async autofillAddress(): Promise<void> {
    try {
      const res = await getAddressByPostalCode(this.organization.postal_code);
      this.organization.region_id = +res.results[0].prefcode;
      this.organization.municipalities = res.results[0].address2;
      this.organization.address = res.results[0].address3;
    } catch(error) {
      this.organization.region_id = '';
      this.organization.municipalities = '';
      this.organization.address = '';
    }
  }

  async autofillFinancialName(): Promise<void> {
    if (!this.isValid.bank_code || !(this.isValid.branch_code || !this.organization.branch_code)) {
      return;
    }

    try {
      const req = this.organization.branch_code ? {
        code: this.organization.bank_code,
        shop_code: this.organization.branch_code,
      } : {
        code: this.organization.bank_code,
      };

      const res = await getFinancialName(req);
      this.financial.bank_name = res.name;
      this.financial.branch_name = res.shop_name;
    } catch(error) {
      this.financial.bank_name = '';
      this.financial.branch_name = '';  
    }
  }

  setEmail($event: InputTextEmit): void {
    this.organization.email = $event.value;
    this.isValid.email = $event.isValid;
    this.updateCanSubmit();
  }

  setPostalCode($event: InputTextEmit): void {
    this.organization.postal_code = $event.value;
    this.isValid.postal_code = $event.isValid;
    this.updateCanSubmit();
  }

  setRegionId(region_id: number): void {
    this.organization.region_id = region_id;
    this.updateCanSubmit();
  }

  setMunicipalities($event: InputTextEmit): void {
    this.organization.municipalities = $event.value;
    this.isValid.municipalities = $event.isValid;
    this.updateCanSubmit();
  }

  setAddress($event: InputTextEmit): void {
    this.organization.address = $event.value;
    this.isValid.address = $event.isValid;
    this.updateCanSubmit();
  }

  setBuildingName($event: InputTextEmit): void {
    this.organization.building_name = $event.value;
    this.isValid.building_name = $event.isValid;
    this.updateCanSubmit();
  }

  async setBankCode($event: InputTextEmit): Promise<void> {
    this.organization.bank_code = $event.value;
    this.isValid.bank_code = $event.isValid;
    this.updateCanSubmit();
    await this.autofillFinancialName();
  }

  async setBranchCode($event: InputTextEmit): Promise<void> {
    this.organization.branch_code = $event.value;
    this.isValid.branch_code = $event.isValid;
    this.updateCanSubmit();
    await this.autofillFinancialName();
  }

  setAccountTypeId(account_type_id: number): void {
    this.organization.account_type_id = account_type_id;
    this.updateCanSubmit();
  }

  setAccountNumber($event: InputTextEmit): void {
    this.organization.account_number = $event.value;
    this.isValid.account_number = $event.isValid;
    this.updateCanSubmit();
  }

  setAccountHolder($event: InputTextEmit): void {
    this.organization.account_holder = $event.value;
    this.isValid.account_holder = $event.isValid;
    this.updateCanSubmit();
  }

  setIcon(icon: File): void {
    this.icon = icon;
    this.updateCanSubmit();
  }

  setTelephoneNumber($event: InputTextEmit): void {
    this.organization.telephone_number = $event.value;
    this.isValid.telephone_number = $event.isValid;
    this.updateCanSubmit();
  }

  updateCanSubmit(): void {
    this.canSubmit = this.isValid.email
      && this.isValid.municipalities
      && this.isValid.address
      && this.isValid.building_name
      && this.isValid.bank_code
      && this.isValid.branch_code
      && this.isValid.account_number
      && this.isValid.account_holder
      && this.isValid.telephone_number
      && this.isValid.postal_code
      && !!this.organization.region_id;
  }
}
</script>

<style lang="scss" scoped>
.form {
  &__error {
    color: var(--red);
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
}

.bank-input {
  &__wrapper {
    display: flex;
    @media screen and (max-width: 992px) {
      flex-direction: column;
    }
  }
  &__code {
    margin-bottom: 0;
    margin-right: 2rem;
    @media screen and (max-width: 992px) {
      margin-right: 0;
    }
  }
  &__name {
    margin-bottom: 0;
    flex: 1;
  }
}
.postal-group {
  @media screen and (max-width: 768px) {
    button {
      margin-top: 3rem;
    }
  }
}
</style>
