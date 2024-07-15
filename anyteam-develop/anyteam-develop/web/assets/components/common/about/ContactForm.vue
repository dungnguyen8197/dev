<template>
  <div>
    <div class="page-wrap">
      <div class="contact__input-group text-left">
        <label class="contact__input-label mt-16 text-sm">
          メールアドレス
          <span class="pc-tablet-only ml-10 badge badge-secondary">必須</span>
        </label>
        <InputText
          class="contact__input-component"
          inputClass="contact__input"
          v-bind:value="states.email.value"
          v-bind:errorMessage="states.email.message"
          @input="checkEmail"
        />
      </div>
      <div class="contact__divider"></div>
      <div class="contact__input-group text-left">
        <label class="contact__input-label mt-16 text-sm">
          件名
          <span class="pc-tablet-only ml-10 badge badge-secondary">必須</span>
        </label>
        <InputText
          class="contact__input-component"
          inputClass="contact__input"
          v-bind:value="states.title.value"
          v-bind:errorMessage="states.title.message"
          @input="(value) => checkRequired(value, 'title')"
        />
      </div>
      <div class="contact__divider"></div>
      <div class="contact__input-group text-left">
        <label class="contact__input-label mt-16 text-sm">
          内容
          <span class="pc-tablet-only ml-10 badge badge-secondary">必須</span>
        </label>
        <Textarea
          class="contact__input-component"
          placeholder="お問い合わせ内容を入力してください"
          inputClass="contact__input"
          v-bind:value="states.message.value"
          v-bind:errorMessage="states.message.message"
          @input="(value) => checkRequired(value, 'message')"
        />
      </div>
    </div>
    <div class="mt-37 ml-24 mr-24 text-left text-sm contact__description">
      <div>
        入力された情報は、お問い合わせ対応のためだけに利用し、
        それ以外の目的では一切利用しません。
      </div>
      <div class="mt-15">
        お問い合わせ回答は、原則2営業日(土日祝を除く)以内に、
        ご回答させていただきます。
      </div>
      <div>
        ※混み具合によって、3営業日以上かかる場合もございま
        す。予めご了承ください。
      </div>
    </div>
    <div class="mt-37"></div>
    <div class="page-wrap">
      <SubmitButton
        v-bind:active="canSubmit"
        label="同意して確認画面へ"
        :handleClick="goToConfirm"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { reactive } from '@vue/reactivity';
import { computed, defineComponent } from '@vue/runtime-core';
import { invalidEmail, invalidRequired } from '../../../constants/messages';
import InputText from '../../form/InputText.vue';
import Textarea from '../../form/Textarea.vue';
import SubmitButton from '../../form/SubmitButton.vue';
export const regex = require('../../../../constants/regex');

export default defineComponent({
  components: {
    InputText,
    Textarea,
    SubmitButton,
  },
  setup(props, context) {
    const states = reactive({
      email: {
        value: '',
        status: false,
        message: '',
      },
      title: {
        value: '',
        status: false,
        message: '',
      },
      message: {
        value: '',
        status: false,
        message: '',
      },
      showModalSuccess: false,
      isConfirm: false,
    });

    const canSubmit = computed(() => {
      return (
        states.email.status && states.title.status && states.message.status
      );
    });

    const checkEmail = (value: string) => {
      states.email.value = value;
      states.email.status = regex.REGEX_EMAIL.test(value) ? true : false;
      states.email.message = !states.email.status ? invalidEmail : '';
    };

    const checkRequired = (value: string, field: string) => {
      states[field].value = value;
      states[field].status = value != '' ? true : false;
      states[field].message = value != '' ? '' : invalidRequired;
    };

    const goToConfirm = async () => {
      states.isConfirm = true;
      context.emit('update:form', states);
    };

    return {
      states,
      canSubmit,
      goToConfirm,
      checkEmail,
      checkRequired,
    };
  },
});
</script>
<style lang="scss" scoped>
.page-wrap {
  padding: 0 5.4rem;
}
.contact {
  &__divider {
    height: 1px;
    margin: 20px 0;
    background-color: var(--gray-color);
  }
  &__input {
    &-label {
      width: 200px;
      margin-right: 10px;
    }
  }
}
@media screen and (min-width: 768px) {
  .contact {
    &__description {
      text-align: center;
    }
    &__input {
      &-group {
        display: flex;
      }
      &-component {
        flex: 1;
        margin-bottom: 0;
      }
    }
  }
  .page-wrap :deep(.contact__input) {
    background-color: var(--light-color);
  }
}
</style>
