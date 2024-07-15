<template>
  <div class="bg-white">
    <div class="section-container pt-40 px-0">
      <PageTitle title="支援内容入力" is-center class="px-16"/>
      <div v-if="supportInfo.team_id">
        <PageSection title="支援先" pc-transperant>
          <div class="support__team-name">{{ supportInfo.team_name }}</div>
        </PageSection>
        <form class="form-theme--default">
          <SupportTypeSelect
            :active-type-id="supportInfo.support_type || 0"
            :amount="supportInfo.support_amount || minAmount"
            @input="updateAmount"
            @update:type="updatePurchaseType"
          />
          <PageSection title="支援者情報" pc-transperant>
            <p class="text-base m-0">入力した情報は、支援先があなたの支援内容を確認するために利用されます。</p>
            <p class="text-sm mt-0">※ 支援者情報はマイページから変更することができます。</p>
            <div class="mt-24">
              <div class="pc-tablet-only support__divider"></div>
              <div class="support__input-group">
                <div class="text-base mt-14 mb-6 flex items-center support__input-label support__input-label--2">
                  お名前
                  <span class="badge badge-secondary mx-7">必須</span>
                </div>
                <div class="w-full">
                  <div class="form-row form-row--inline">
                    <InputText
                      label="姓" input-name="lastname"
                      :value="supportInfo.lastname"
                      :error-message="errorMessage.lastname"
                      @input="($event) => updateField($event, 'lastname')"
                    />
                  </div>
                  <div class="form-row form-row--inline">
                    <InputText
                      label="名" input-name="firstname"
                      :value="supportInfo.firstname"
                      :error-message="errorMessage.firstname"
                      @input="($event) => updateField($event, 'firstname')"
                    />
                  </div>
                </div>
              </div>
              <div class="pc-tablet-only support__divider"></div>
              <div class="support__input-group">
                <div class="text-base mt-14 mb-6 flex items-center support__input-label support__input-label--2">
                  フリガナ
                  <span class="badge badge-secondary mx-7">必須</span>
                </div>
                <div class="w-full">
                  <div class="form-row form-row--inline">
                    <InputText
                      label="セイ" input-name="lastname_kana"
                      :value="supportInfo.lastname_kana"
                      :error-message="errorMessage.lastname_kana"
                      @input="($event) => updateField($event, 'lastname_kana')"
                    />
                  </div>
                  <div class="form-row form-row--inline">
                    <InputText
                      label="メイ" input-name="firstname_kana"
                      :value="supportInfo.firstname_kana"
                      :error-message="errorMessage.firstname_kana"
                      @input="($event) => updateField($event, 'firstname_kana')"
                    />
                  </div>
                </div>
              </div>
              <div class="pc-tablet-only support__divider"></div>
              <div class="support__input-group">
                <div class="text-base mt-14 mb-6 flex items-center support__input-label support__input-label--1">
                  性別
                  <span class="badge badge-secondary mx-7">必須</span>
                </div>
                <div class="form-row form-row--inline">
                  <Item :error-message="errorMessage.gender_type">
                    <InputRadio
                      input-name="gender_type_id" :value="1" v-model="supportInfo.gender_type_id" text="男性" class="mr-15"
                      @input="($event) => updateField($event, 'gender_type_id', true)"
                    />
                    <InputRadio
                      input-name="gender_type_id" :value="2" v-model="supportInfo.gender_type_id" text="女性"
                      @input="($event) => updateField($event, 'gender_type', true)"
                    />
                  </Item>
                </div>
              </div>
              <div class="pc-tablet-only support__divider"></div>
              <div class="support__input-group">
                <div class="text-base mt-14 mb-6 flex items-center support__input-label support__input-label--1">
                  生年月日<span class="badge badge-secondary mx-7">必須</span>
                </div>
                <div class="form-row form-row--inline">
                  <Item :error-message="errorMessage.birthday">
                    <InputDatePicker
                      v-bind:value="supportInfo.birthday"
                      @update:modelValue="($event) => updateField($event, 'birthday')"
                    ></InputDatePicker>
                  </Item>
                </div>
              </div>
              <div class="pc-tablet-only support__divider"></div>
              <div class="support__input-group">
                <div class="text-base mt-14 mb-6 flex items-center support__input-label support__input-label--2">
                  住所<span class="badge badge-secondary mx-7">必須</span>
                </div>
                <div class="w-full">
                  <div class="support__input-group">
                    <div class="text-xs mt-14 support__input-label support__input-label--3">郵便番号</div>
                    <div class="form-row form-row--inline">
                      <Item :error-message="errorMessage.postal_code">
                        <div class="flex items-center">
                          <InputPostalCode
                            :value="supportInfo.postal_code"
                            @update:modelValue="($event) => updateField($event, 'postal_code')"
                          ></InputPostalCode>
                          <button 
                            class="btn btn-secondary ml-16" style="min-height: 42px;"
                            type="button"
                            @click="autofillAddress"
                          >住所検索</button>
                        </div>
                      </Item>              
                    </div>
                  </div>
                  <div class="support__input-group">
                    <div class="text-xs mt-14 support__input-label support__input-label--3">都道府県</div>
                    <div class="form-row form-row--inline w-full">
                      <Item :error-message="errorMessage.region_id">
                        <InputSelect
                          class="w-50"
                          input-name="region_id"
                          :value="supportInfo.region_id"
                          :options="regionOptions"
                          @update:modelValue="($event) => updateField($event, 'region_id', true)"
                        ></InputSelect>
                      </Item>
                    </div>
                  </div>
                  <div class="support__input-group">
                    <div class="text-xs mt-14 support__input-label support__input-label--3">市区町村</div>
                    <div class="form-row form-row--inline w-full">
                      <Item :error-message="errorMessage.municipalities">
                        <InputTextField
                          input-name="municipalities"
                          :value="supportInfo.municipalities"
                          @input="($event) => updateField($event, 'municipalities')"
                          class="w-50"
                        ></InputTextField>
                      </Item>
                    </div>
                  </div>
                  <div class="support__input-group">
                    <div class="text-xs mt-14 support__input-label support__input-label--3">番地以下</div>
                    <div class="form-row form-row--inline w-full">
                      <Item :error-message="errorMessage.address">
                        <InputTextField
                          input-name="address"
                          :value="supportInfo.address"
                          @input="($event) => updateField($event, 'address')"
                          class="w-50"
                        ></InputTextField>
                      </Item>
                    </div>
                  </div>
                  <div class="support__input-group">
                    <div class="text-xs mt-14 support__input-label support__input-label--3">建物など</div>
                    <div class="form-row form-row--inline w-full">
                      <Item>
                        <InputTextField
                          class="w-50"
                          input-name="building_name"
                          :value="supportInfo.building_name"
                          @input="($event) => updateField($event, 'building_name')"
                        ></InputTextField>
                      </Item>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pc-tablet-only support__divider"></div>
              <div class="support__input-group">
                <div class="text-base mt-14 mb-6 support__input-label support__input-label--1">
                  出身大学 
                </div>
                <div class="form-row form-row--inline w-full">
                  <Item>
                    <InputTextField
                      class="w-50"
                      input-name="university_name"
                      :value="supportInfo.university_name"
                      @input="($event) => updateField($event, 'university_name')"
                    ></InputTextField>
                  </Item>
                </div>
              </div>
              <div class="pc-tablet-only support__divider"></div>
              <div class="support__input-group">
                <div class="text-base mt-14 mb-6 support__input-label support__input-label--1">
                  部活動(大学) 
                </div>
                <div class="form-row form-row--inline w-full">
                  <Item>
                    <InputTextField
                      class="w-50"
                      input-name="university_club"
                      :value="supportInfo.university_club"
                      @input="($event) => updateField($event, 'university_club')"
                    ></InputTextField>
                  </Item>
                </div>
              </div>
              <div class="pc-tablet-only support__divider"></div>
              <div class="support__input-group">
                <div class="text-base mt-14 mb-6 support__input-label support__input-label--1">
                  出身高校 
                </div>
                <div class="form-row form-row--inline w-full">
                  <Item>
                    <InputTextField
                      class="w-50"
                      input-name="high_school_name"
                      :value="supportInfo.high_school_name"
                      @input="($event) => updateField($event, 'high_school_name')"
                    ></InputTextField>
                  </Item>
                </div>
              </div>
              <div class="pc-tablet-only support__divider"></div>
              <div class="support__input-group">
                <div class="text-base mt-14 mb-6 support__input-label support__input-label--1">
                  部活動(高校) 
                </div>
                <div class="form-row form-row--inline w-full">
                  <Item>
                    <InputTextField
                      class="w-50"
                      input-name="high_school_club"
                      :value="supportInfo.high_school_club"
                      @input="($event) => updateField($event, 'high_school_club')"
                    ></InputTextField>
                  </Item>
                </div>
              </div>
              <div class="pc-tablet-only support__divider"></div>
              <div class="support__input-group">
                <div class="text-base mt-14 mb-6 support__input-label support__input-label--1">
                  出身中学
                </div>
                <div class="form-row form-row--inline w-full">
                  <Item>
                    <InputTextField
                      class="w-50"
                      input-name="junior_high_school_name"
                      :value="supportInfo.junior_high_school_name"
                      @input="($event) => updateField($event, 'junior_high_school_name')"
                    ></InputTextField>
                  </Item>
                </div>
              </div>
              <div class="pc-tablet-only support__divider"></div>
              <div class="support__input-group">
                <div class="text-base mt-14 mb-6 support__input-label support__input-label--1">
                  部活動(中学)
                </div>
                <div class="form-row form-row--inline w-full">
                  <Item>
                    <InputTextField
                      class="w-50"
                      input-name="junior_high_school_club"
                      :value="supportInfo.junior_high_school_club"
                      @input="($event) => updateField($event, 'junior_high_school_club')"
                    ></InputTextField>
                  </Item>
                </div>
              </div>
              <div class="pc-tablet-only support__divider"></div>
              <div class="support__input-group">
                <div class="text-base mt-14 mb-6 support__input-label support__input-label--1">
                  好きな競技
                </div>
                <div class="form-row form-row--inline w-full">
                  <Item>
                    <InputTextField
                      class="w-50"
                      input-name="favorite_competition1"
                      placeholder="複数入力可"
                      :value="supportInfo.favorite_competition1"
                      @input="($event) => updateField($event, 'favorite_competition1')"
                    ></InputTextField>
                  </Item>
                  <Item>
                    <InputTextField
                      class="w-50"
                      input-name="favorite_competition2"
                      :value="supportInfo.favorite_competition2"
                      @input="($event) => updateField($event, 'favorite_competition2')"
                    ></InputTextField>
                  </Item>
                  <Item>
                    <InputTextField
                      class="w-50"
                      input-name="favorite_competition3"
                      :value="supportInfo.favorite_competition3"
                      @input="($event) => updateField($event, 'favorite_competition3')"
                    ></InputTextField>
                  </Item>
                </div>
              </div>
              <div class="pc-tablet-only support__divider"></div>
              <div class="support__input-group">
                <div class="text-base mt-14 mb-6 support__input-label support__input-label--1">
                  好きなチーム
                </div>
                <div class="form-row form-row--inline w-full">
                  <Item>
                    <InputTextField
                      class="w-50"
                      input-name="favorite_team1"
                      placeholder="複数入力可"
                      :value="supportInfo.favorite_team1"
                      @input="($event) => updateField($event, 'favorite_team1')"
                    ></InputTextField>
                  </Item>
                  <Item>
                    <InputTextField
                      class="w-50"
                      input-name="favorite_team2"
                      :value="supportInfo.favorite_team2"
                      @input="($event) => updateField($event, 'favorite_team2')"
                    ></InputTextField>
                  </Item>
                  <Item>
                    <InputTextField
                      class="w-50"
                      input-name="favorite_team3"
                      :value="supportInfo.favorite_team3"
                      @input="($event) => updateField($event, 'favorite_team3')"
                    ></InputTextField>
                  </Item>
                </div>
              </div>
            </div>
          </PageSection>
          <PageSection title="支援者名簿への掲載" class="support__anonymous">
            <p class="text-base mt-0">
              支援を行うと、部活ページ内の支援者一覧にお名前と支援開始日が掲載されます。
              支援者一覧への掲載を希望されない場合は、以下のチェックボックスを選択してください。
            </p>
            <div class="flex justify-center">
              <InputCheck
                :value="supportInfo.is_anonymous"
                text="匿名での支援を希望する"
                input-name="is_anonymous"
                @input="($event) => updateField($event, 'is_anonymous')"
              />
            </div>
            <p class="text-sm">
              ※ 支援者一覧は、同じ部活へ支援を行なった方のみが閲覧できます。
            </p>
          </PageSection>
          <div class="text-center mt-40 mb-60">
            <SubmitButton :active="canSubmit && !inProcess" v-bind:handle-click="handleSubmit" label="お支払い方法の選択へ" />
          </div>
          <div style="height: 1px"></div>
        </form>
      </div>
      <div class="px-16" v-else>{{ noData }}</div>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, inject } from '@vue/runtime-core';
import { ref, computed } from '@vue/reactivity';
import PageTitle from '../../components/common/page/PageTitle.vue';
import PageSection from '../../components/common/page/PageSection.vue';
import SupportTypeSelect from '../../components/common/support/TypeSelectSection.vue';
import Item from '../../components/form/Item.vue';
import InputText from '../../components/form/InputText.vue';
import InputTextField from '../../components/form/InputTextField.vue';
import InputCheck from '../../components/form/InputCheckbox.vue';
import InputRadio from '../../components/form/InputRadio.vue';
import InputDatePicker from '../../components/form/InputDatePicker.vue';
import InputPostalCode from '../../components/form/InputPostalCode.vue';
import InputSelect from '../../components/form/InputSelect.vue';
import SubmitButton from '../../components/form/SubmitButton.vue';
import Footer from '../../components/Footer.vue';
import { ProfileErrorMessage } from '../../types/user/profile';
import { OptionInterface } from '../../types/select-option';
import { RegionGroupsRO } from '../../types/region';
import { SupportInfo } from '../../types/support/info';
import { invalidLength, invalidRequired, noData } from '../../constants/messages';
import { getRegionsFromGroups } from '../../helpers/region';
import { toJapaneseDateString } from '../../helpers/datetime';
import { registerSupport } from '../../api/support';
import { getAddressByPostalCode } from '../../api/address';

export default defineComponent({
  components: {
    SupportTypeSelect,
    Item,
    InputText,
    InputTextField,
    InputCheck,
    InputRadio,
    InputDatePicker,
    InputPostalCode,
    InputSelect,
    SubmitButton,
    PageTitle,
    PageSection,
    Footer,
},
  setup() {
    const inProcess = ref<boolean>(false);
    const supportInfo = ref<SupportInfo>({} as SupportInfo);
    const errorMessage = ref({} as ProfileErrorMessage);
    const regionOptions = ref<OptionInterface[]>([]);
    const supportValid = ref<boolean>(false);
    const minAmount = ref(0);
    const canSubmit = computed<boolean>(() => {
      return !!supportInfo.value.firstname
        && !!supportInfo.value.firstname_kana
        && !!supportInfo.value.lastname
        && !!supportInfo.value.lastname_kana
        && !!supportInfo.value.address
        && !!supportInfo.value.municipalities
        && !!supportInfo.value.region_id
        && !!supportInfo.value.gender_type_id
        && !!supportInfo.value.birthday
        && supportValid.value
        && supportInfo.value.postal_code.length === 8
    })

    const autofillAddress = async () => {
      try {
        const response = await getAddressByPostalCode(supportInfo.value.postal_code);
        supportInfo.value.region_id = +response.results[0].prefcode;
        supportInfo.value.address = response.results[0].address2;
        supportInfo.value.municipalities = response.results[0].address3;
      } catch {
        supportInfo.value.region_id = 0;
        supportInfo.value.address = '';
        supportInfo.value.municipalities = '';
        errorMessage.value.postal_code = '郵便番号と住所を正しく入力してください';
      }
    }

    const handleSubmit = async (e: Event) => {
      try {
        inProcess.value = true;
        await registerSupport(supportInfo.value);
        window.location.href = '/support/wallet';
      } catch (err) {}
      inProcess.value = false;
    }

    const updateField = (event: string | boolean, field: string, isNumber = false) => {
      supportInfo.value[field] = isNumber ? Number(event) : event;
      if (typeof errorMessage.value[field] !== undefined) {
        validate(field);
      }
    }

    const validate = (field: string): void => {
      errorMessage.value[field] = supportInfo.value[field] ? '' : invalidRequired;

      if (field === 'postal_code') {
        errorMessage.value[field] = supportInfo.value[field].length === 8 ? '' : invalidLength(7);
      }
    }

    const updateAmount = ($event: { amount: number, isValid: boolean }) => {
      supportInfo.value.support_amount = $event.amount;
      supportValid.value = $event.isValid;
    }

    const updatePurchaseType = ($event: { type: number, title: string,  minAmount: number}) => {
      supportInfo.value.support_type = $event.type;
      supportInfo.value.support_amount = undefined;
      supportInfo.value.support_type_name = $event.title;
      supportValid.value = false;
    }

    onMounted(async () => {
      const $appData = inject('$appData') as { 
        supportInfo: SupportInfo,
        regionGroups: RegionGroupsRO,
        supportValid: boolean,
      };
      supportInfo.value = $appData.supportInfo;
      supportValid.value = $appData.supportValid;
      if (!supportInfo.value.birthday) {
        supportInfo.value.birthday = toJapaneseDateString(new Date());
      }

      const regions = getRegionsFromGroups($appData.regionGroups.groups);
      regions.map(region => {
        regionOptions.value.push({
          value: region.id,
          name: region.name,
        });
      });
    });

    return {
      inProcess,
      noData,
      canSubmit,
      errorMessage,
      supportInfo,
      minAmount,
      regionOptions,
      updateField,
      autofillAddress,
      handleSubmit,
      updateAmount,
      updatePurchaseType,
    }
  }
});
</script>

<style lang="scss" scoped>
.support {
  &__divider {
    width: 100%;
    height: 1px;
    background-color: var(--light-color);
    margin-top: 8px;
    margin-bottom: 8px;
  }
  @media screen and (min-width: 768px) {
    &__anonymous,
    &__team-name {
      text-align: center;
    }
    &__input-group {
      display: flex;
      align-items: flex-start;
    }
  }
}
</style>
