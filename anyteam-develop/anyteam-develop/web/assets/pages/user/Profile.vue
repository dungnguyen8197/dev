<template>
  <div>
    <div class="user-container">
      <div class="user-sidebar">
        <Menu></Menu>
      </div>
      <div class="user-content">
        <PageTitle title="会員情報" class="px-16 sp-only"/>
        <form class="form-theme--default">
          <div class="com-user-profile">
            <h2 class="text-normal pc-tablet-only text-center">会員情報</h2>
            <div class="pc-tablet-only com-user-profile__divider"></div>
            <div class="com-user-profile__thumbnail com-user-profile__input-group">
              <div class="text-base mt-14 mb-6 flex items-center profile__input-label profile__input-label--2 pc-tablet-only">
                画像
              </div>
              <InputImage
                v-bind:thumbnail-url="userProfile.thumbnail_url"
                @update:image="updateThumbnail"
              />
            </div>
            <div class="pc-tablet-only com-user-profile__divider"></div>
            <p class="text-sm text-center text-danger mt-24">{{ errorMessage.common }}</p>
            <div class="com-user-profile__form mt-24">
              <div class="com-user-profile__input-group">
                <div class="text-base mt-14 mb-6 flex items-center profile__input-label profile__input-label--2">
                  お名前
                  <span class="badge badge-secondary mx-7">必須</span>
                </div>
                <div class="w-full">
                  <div class="form-row form-row--inline">
                    <InputText
                      label="姓" input-name="lastname"
                      :value="userProfile.lastname"
                      :error-message="errorMessage.lastname"
                      @input="($event) => updateField($event, 'lastname')"
                    />
                  </div>
                  <div class="form-row form-row--inline">
                    <InputText
                      label="名" input-name="firstname"
                      :value="userProfile.firstname"
                      :error-message="errorMessage.firstname"
                      @input="($event) => updateField($event, 'firstname')"
                    />
                  </div>
                </div>
              </div>
              <div class="pc-tablet-only com-user-profile__divider"></div>
              <div class="com-user-profile__input-group">
                <div class="text-base mt-14 mb-6 flex items-center profile__input-label profile__input-label--2">
                  フリガナ
                  <span class="badge badge-secondary mx-7">必須</span>
                </div>
                <div class="w-full">
                  <div class="form-row form-row--inline">
                    <InputText
                      label="セイ" input-name="lastname_kana"
                      :value="userProfile.lastname_kana"
                      :error-message="errorMessage.lastname_kana"
                      @input="($event) => updateField($event, 'lastname_kana')"
                    />
                  </div>
                  <div class="form-row form-row--inline">
                    <InputText
                      label="メイ" input-name="firstname_kana"
                      :value="userProfile.firstname_kana"
                      :error-message="errorMessage.firstname_kana"
                      @input="($event) => updateField($event, 'firstname_kana')"
                    />
                  </div>
                </div>
              </div>
              <div class="pc-tablet-only com-user-profile__divider"></div>
              <div class="com-user-profile__input-group">
                <div class="text-base mt-14 mb-6 flex items-center profile__input-label profile__input-label--1">
                  性別
                  <span class="badge badge-secondary mx-7">必須</span>
                </div>
                <div class="form-row form-row--inline">
                  <Item :error-message="errorMessage.gender_type">
                    <InputRadio
                      input-name="gender_type_id" :value="1" v-model="userProfile.gender_type" text="男性" class="mr-15"
                      @input="($event) => updateField($event, 'gender_type', true)"
                    />
                    <InputRadio
                      input-name="gender_type_id" :value="2" v-model="userProfile.gender_type" text="女性"
                      @input="($event) => updateField($event, 'gender_type', true)"
                    />
                  </Item>
                </div>
              </div>
              <div class="pc-tablet-only com-user-profile__divider"></div>
              <div class="com-user-profile__input-group">
                <div class="text-base mt-14 mb-6 flex items-center profile__input-label profile__input-label--1">
                  生年月日
                  <span class="badge badge-secondary mx-7">必須</span>
                </div>
                <div class="form-row form-row--inline">
                  <Item :error-message="errorMessage.birthday">
                    <InputDatePicker
                      v-bind:value="userProfile.birthday"
                      @update:modelValue="($event) => updateField($event, 'birthday')"
                    ></InputDatePicker>
                  </Item>
                </div>
              </div>
              <div class="pc-tablet-only com-user-profile__divider"></div>
              <div class="com-user-profile__input-group">
                <div class="text-base mt-14 mb-6 flex items-center profile__input-label profile__input-label--2">
                  住所
                  <span class="badge badge-secondary mx-7">必須</span>
                </div>
                <div class="w-full">
                  <div class="com-user-profile__input-group">
                    <div class="text-xs mt-14 support__input-label support__input-label--3">郵便番号</div>
                    <div class="form-row form-row--inline">
                      <Item :error-message="errorMessage.postal_code">
                        <div class="flex items-center">
                          <InputPostalCode
                            :value="userProfile.postal_code"
                            @update:modelValue="($event) => updateField($event, 'postal_code')"
                          ></InputPostalCode>
                          <button 
                            class="btn btn-primary ml-16" style="min-height: 42px;"
                            type="button"
                            @click="autofillAddress"
                          >住所検索</button>
                        </div>
                      </Item>
                    </div>
                  </div>
                  <div class="com-user-profile__input-group">
                    <div class="text-xs mt-14 support__input-label support__input-label--3">都道府県</div>
                    <div class="form-row form-row--inline w-full">
                      <Item :error-message="errorMessage.region_id">
                        <InputSelect
                          class="w-50"
                          input-name="region_id"
                          :value="userProfile.region_id"
                          :options="regionOptions"
                          @update:modelValue="($event) => updateField($event, 'region_id', true)"
                        ></InputSelect>
                      </Item>
                    </div>
                  </div>
                  <div class="com-user-profile__input-group">
                    <div class="text-xs mt-14 support__input-label support__input-label--3">市区町村</div>
                    <div class="form-row form-row--inline w-full">
                      <Item :error-message="errorMessage.municipalities">
                        <InputTextField
                          input-name="municipalities"
                          :value="userProfile.municipalities"
                          @input="($event) => updateField($event, 'municipalities')"
                          class="w-50"
                        ></InputTextField>
                      </Item>
                    </div>
                  </div>
                  <div class="com-user-profile__input-group">
                    <div class="text-xs mt-14 support__input-label support__input-label--3">番地以下</div>
                    <div class="form-row form-row--inline w-full">
                      <Item :error-message="errorMessage.address">
                        <InputTextField
                          input-name="address"
                          :value="userProfile.address"
                          @input="($event) => updateField($event, 'address')"
                          class="w-50"
                        ></InputTextField>
                      </Item>
                    </div>
                  </div>
                  <div class="com-user-profile__input-group">
                    <div class="text-xs mt-14 support__input-label support__input-label--3">任意</div>
                    <div class="form-row form-row--inline w-full">
                      <Item>
                        <div class="text-xs mb-2">
                        </div>
                        <InputTextField
                          class="w-50"
                          input-name="building_name"
                          :value="userProfile.building_name"
                          @input="($event) => updateField($event, 'building_name')"
                        ></InputTextField>
                      </Item>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pc-tablet-only com-user-profile__divider"></div>
              <div class="com-user-profile__input-group">
                <div class="text-base mt-14 support__input-label support__input-label--1">出身大学</div>
                <div class="form-row form-row--inline w-full">
                  <Item>
                    <InputTextField
                      class="w-50"
                      input-name="university_name"
                      :value="userProfile.university_name"
                      @input="($event) => updateField($event, 'university_name')"
                    ></InputTextField>
                  </Item>
                </div>
              </div>
              <div class="pc-tablet-only com-user-profile__divider"></div>
              <div class="com-user-profile__input-group">
                <div class="text-base mt-14 support__input-label support__input-label--1">部活動(大学)</div>
                <div class="form-row form-row--inline w-full">
                  <Item>
                    <InputTextField
                      class="w-50"
                      input-name="university_club"
                      :value="userProfile.university_club"
                      @input="($event) => updateField($event, 'university_club')"
                    ></InputTextField>
                  </Item>
                </div>
              </div>
              <div class="pc-tablet-only com-user-profile__divider"></div>
              <div class="com-user-profile__input-group">
                <div class="text-base mt-14 support__input-label support__input-label--1">出身高校</div>
                <div class="form-row form-row--inline w-full">
                  <Item>
                    <InputTextField
                      class="w-50"
                      input-name="high_school_name"
                      :value="userProfile.high_school_name"
                      @input="($event) => updateField($event, 'high_school_name')"
                    ></InputTextField>
                  </Item>
                </div>
              </div>
              <div class="pc-tablet-only com-user-profile__divider"></div>
              <div class="com-user-profile__input-group">
                <div class="text-base mt-14 support__input-label support__input-label--1">部活動(高校)</div>
                <div class="form-row form-row--inline w-full">
                  <Item>
                    <InputTextField
                      class="w-50"
                      input-name="high_school_club"
                      :value="userProfile.high_school_club"
                      @input="($event) => updateField($event, 'high_school_club')"
                    ></InputTextField>
                  </Item>
                </div>
              </div>
              <div class="pc-tablet-only com-user-profile__divider"></div>
              <div class="com-user-profile__input-group">
                <div class="text-base mt-14 support__input-label support__input-label--1">出身中学</div>
                <div class="form-row form-row--inline w-full">
                  <Item>
                    <InputTextField
                      class="w-50"
                      input-name="junior_high_school_name"
                      :value="userProfile.junior_high_school_name"
                      @input="($event) => updateField($event, 'junior_high_school_name')"
                    ></InputTextField>
                  </Item>
                </div>
              </div>
              <div class="pc-tablet-only com-user-profile__divider"></div>
              <div class="com-user-profile__input-group">
                <div class="text-base mt-14 support__input-label support__input-label--1">部活動(中学)</div>
                <div class="form-row form-row--inline w-full">
                  <Item>
                    <InputTextField
                      class="w-50"
                      input-name="junior_high_school_club"
                      :value="userProfile.junior_high_school_club"
                      @input="($event) => updateField($event, 'junior_high_school_club')"
                    ></InputTextField>
                  </Item>
                </div>
              </div>
              <div class="pc-tablet-only com-user-profile__divider"></div>
              <div class="com-user-profile__input-group">
                <div class="text-base mt-14 support__input-label support__input-label--1">好きな競技</div>
                <div class="w-full">
                  <div class="form-row form-row--inline">
                    <Item>
                      <InputTextField
                        placeholder="複数入力可"
                        class="w-50"
                        input-name="favorite_competition1"
                        :value="userProfile.favorite_competition1"
                        @input="($event) => updateField($event, 'favorite_competition1')"
                      ></InputTextField>
                    </Item>
                    <Item>
                      <InputTextField
                        class="w-50"
                        input-name="favorite_competition2"
                        :value="userProfile.favorite_competition2"
                        @input="($event) => updateField($event, 'favorite_competition2')"
                      ></InputTextField>
                    </Item>
                    <Item>
                      <InputTextField
                        class="w-50"
                        input-name="favorite_competition3"
                        :value="userProfile.favorite_competition3"
                        @input="($event) => updateField($event, 'favorite_competition3')"
                      ></InputTextField>
                    </Item>
                  </div>
                </div>
              </div>
              <div class="pc-tablet-only com-user-profile__divider"></div>
              <div class="com-user-profile__input-group">
                <div class="text-base mt-14 support__input-label support__input-label--1">好きなチーム</div>
                <div class="w-full">
                  <div class="form-row form-row--inline">
                    <Item>
                      <InputTextField
                        placeholder="複数入力可"
                        class="w-50"
                        input-name="favorite_team1"
                        :value="userProfile.favorite_team1"
                        @input="($event) => updateField($event, 'favorite_team1')"
                      ></InputTextField>
                    </Item>
                    <Item>
                      <InputTextField
                        class="w-50"
                        input-name="favorite_team2"
                        :value="userProfile.favorite_team2"
                        @input="($event) => updateField($event, 'favorite_team2')"
                      ></InputTextField>
                    </Item>
                    <Item>
                      <InputTextField
                        class="w-50"
                        input-name="favorite_team3"
                        :value="userProfile.favorite_team3"
                        @input="($event) => updateField($event, 'favorite_team3')"
                      ></InputTextField>
                    </Item>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="text-center mt-40 mb-40">
            <SubmitButton :active="canSubmit && !inProcess" v-bind:handle-click="handleSubmit" label="更新する" />
          </div>
          <div class="link mt-15 mb-60">
            <a href="/user/withdrawal">退会を希望の方はこちら</a>
          </div>
          <div style="height: 1px;"></div>
        </form>
      </div>
    </div>
    
    <Footer/>
    <Modal v-if="updateDone">
      <p class="text-center">ユーザー情報が更新されました</p>
      <SubmitButton label="戻る" active v-bind:handle-click="closeModal" />
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted } from '@vue/runtime-core';
import { computed, ref } from '@vue/reactivity';
import PageHeader from '../../components/common/page/PageHeader.vue';
import Item from '../../components/form/Item.vue';
import InputText from '../../components/form/InputText.vue';
import InputTextField from '../../components/form/InputTextField.vue';
import InputCheck from '../../components/form/InputCheckbox.vue';
import InputRadio from '../../components/form/InputRadio.vue';
import InputDatePicker from '../../components/form/InputDatePicker.vue';
import InputPostalCode from '../../components/form/InputPostalCode.vue';
import InputSelect from '../../components/form/InputSelect.vue';
import InputImage from '../../components/form/InputImage.vue';
import SubmitButton from '../../components/form/SubmitButton.vue';
import Modal from '../../components/Modal.vue';
import Footer from '../../components/Footer.vue';
import Menu from '../../components/common/sidebar/Menu.vue';
import PageTitle from '../../components/common/page/PageTitle.vue';
import { ProfileErrorMessage, UserProfileRequest, UserProfileRO } from '../../types/user/profile';
import { OptionInterface } from '../../types/select-option';
import { RegionGroupsRO } from '../../types/region';
import { invalidLength, invalidRequired, updateFailureMessage } from '../../constants/messages';
import { getRegionsFromGroups } from '../../helpers/region';
import { toJapaneseDateString } from '../../helpers/datetime';
import { updateUser } from '../../api/users';
import { getAddressByPostalCode } from '../../api/address';

export default defineComponent({
  components: {
    Modal,
    SubmitButton,
    PageHeader,
    Item,
    InputText,
    InputTextField,
    InputCheck,
    InputRadio,
    InputDatePicker,
    InputPostalCode,
    InputSelect,
    InputImage,
    PageTitle,
    Footer,
    Menu
},
  setup() {
    const userProfile = ref<UserProfileRO>({} as UserProfileRO);
    const regionOptions = ref<OptionInterface[]>([]);
    const thumbnail = ref<File | null>(null);
    const errorMessage = ref({} as ProfileErrorMessage);
    const updateDone = ref<boolean>(false);
    const inProcess = ref<boolean>(false);

    const formData = computed((): UserProfileRequest => {
      const {
        id, gender_type, thumbnail_url,
        ...formData
      } = Object.assign({}, userProfile.value, {
        gender_type_id: userProfile.value.gender_type,
      });

      return {
        firstname: userProfile.value.firstname,
        lastname: userProfile.value.lastname,
        firstname_kana: userProfile.value.firstname_kana,
        lastname_kana: userProfile.value.lastname_kana,
        is_anonymous: userProfile.value.is_anonymous,
        gender_type_id: userProfile.value.gender_type,
        birthday: userProfile.value.birthday,
        postal_code: userProfile.value.postal_code,
        region_id: userProfile.value.region_id,
        municipalities: userProfile.value.municipalities,
        address: userProfile.value.address,
        building_name: userProfile.value.building_name,
        university_name: userProfile.value.university_name,
        university_club: userProfile.value.university_club,
        high_school_name: userProfile.value.high_school_name,
        high_school_club: userProfile.value.high_school_club,
        junior_high_school_name: userProfile.value.junior_high_school_name,
        junior_high_school_club: userProfile.value.junior_high_school_club,
        favorite_team1: userProfile.value.favorite_team1,
        favorite_team2: userProfile.value.favorite_team2,
        favorite_team3: userProfile.value.favorite_team3,
        favorite_competition1: userProfile.value.favorite_competition1,
        favorite_competition2: userProfile.value.favorite_competition2,
        favorite_competition3: userProfile.value.favorite_competition3,
      };
    });

    const canSubmit = computed<boolean>(() => {
      return !!userProfile.value.firstname
          && !!userProfile.value.firstname_kana
          && !!userProfile.value.lastname
          && !!userProfile.value.lastname_kana
          && !!userProfile.value.address
          && !!userProfile.value.municipalities
          && !!userProfile.value.region_id
          && !!userProfile.value.gender_type
          && !!userProfile.value.birthday
          && userProfile.value.postal_code.length === 8
    })

    const updateThumbnail = (event: File) => {
      thumbnail.value = event;
    }

    const updateField = (event: string | boolean, field: string, isNumber = false) => {
      userProfile.value[field] = isNumber ? Number(event) : event;
      if (typeof errorMessage.value[field] !== undefined) {
        validate(field);
      }
    }

    const autofillAddress = async () => {
      try {
        const response = await getAddressByPostalCode(userProfile.value.postal_code);
        userProfile.value.region_id = +response.results[0].prefcode;
        userProfile.value.address = response.results[0].address2;
        userProfile.value.municipalities = response.results[0].address3;
      } catch {
        userProfile.value.region_id = 0;
        userProfile.value.address = '';
        userProfile.value.municipalities = '';
        errorMessage.value.postal_code = '郵便番号と住所を正しく入力してください';
      }
    }

    const handleSubmit = async (event: Event): Promise<void> => {
      errorMessage.value.common = '';
      inProcess.value = true;

      const form = new FormData();
      form.append('profile', JSON.stringify(formData.value));
      if (thumbnail.value) {
        form.append('thumbnail', thumbnail.value);
      }

      try {
        await updateUser(form);
        updateDone.value = true;
      } catch (error) {
        errorMessage.value.common = updateFailureMessage;
      } finally {
        inProcess.value = false;
      }
    }

    const validate = (field: string): void => {
      errorMessage.value[field] = userProfile.value[field] ? '' : invalidRequired;

      if (field === 'postal_code') {
        errorMessage.value[field] = userProfile.value[field].length === 8 ? '' : invalidLength(7);
      }
    }

    const closeModal = () => {
      window.location.href = '/user';
    }

    onMounted(async () => {
      const $appData = inject('$appData') as { user: UserProfileRO, regionGroups: RegionGroupsRO };

      userProfile.value = $appData.user;
      if (!userProfile.value.birthday) {
        userProfile.value.birthday = toJapaneseDateString(new Date());
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
      userProfile,
      regionOptions,
      errorMessage,
      canSubmit,
      updateDone,
      inProcess,
      closeModal,
      autofillAddress,
      updateThumbnail,
      updateField,
      handleSubmit,
    }
  },
});
</script>
<style lang="scss" scoped>
.com-user-profile {
  background: var(--light-color);
  padding: 30px;
  &__divider {
    width: 100%;
    height: 1px;
    background-color: #E3E3E3;
    margin-top: 8px;
    margin-bottom: 8px;
  }
  @media screen and (min-width: 768px) {
    &__input-group {
      display: flex;
      align-items: flex-start;
    }
  }
  @media screen and (max-width: 767px) {
    &__thumbnail {
      text-align: center;
    }
  }
}
.link {
   & > a {
    color: var(--secondary-color);
    text-align: center;
    display: block;
  }
}
</style>

