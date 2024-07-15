<template>
  <div class="contact-confirm">
    <div class="sp-only font-15">内容を語確認の上、送信してください</div>
    <div class="contact-confirm__item">
      <div class="contact-confirm__label">メールアドレス</div>
      <div class="contact-confirm__value">{{ form.email }}</div>
    </div>
    <div class="contact-confirm__item">
      <div class="contact-confirm__label">件名</div>
      <div class="contact-confirm__value">{{ form.title }}</div>
    </div>
    <div class="contact-confirm__item">
      <div class="contact-confirm__label">内容</div>
      <pre class="contact-confirm__value">{{ form.message }}</pre>
    </div>
    <div class="contact-confirm__link" @click="backToEditForm">
      お問い合わせ内容を変更する
    </div>
    <SubmitButton active label="送信する" :handleClick="sendEmail" class="mt-30"/>
  </div>
</template>

<script lang="ts">
import InputText from '../../form/InputText.vue';
import Textarea from '../../form/Textarea.vue';
import SubmitButton from '../../form/SubmitButton.vue';
import { defineComponent } from '@vue/runtime-core';

export default defineComponent({
  components: {
    InputText,
    Textarea,
    SubmitButton,
  },
  props: {
    form: {
      type: Object,
      required: true,
    },
  },
  setup(props, context) {
    const sendEmail = () => {
      context.emit('event:send');
    };
    const backToEditForm = () => {
      context.emit('event:edit');
    };
    return {
      sendEmail,
      backToEditForm,
    };
  },
});
</script>
<style lang="scss" scoped>
.contact-confirm {
  text-align: left;
  min-height: 55vh;
  padding-top: 40px;
  padding-bottom: 40px;
  &__item {
    margin-top: 20px;
  }
  &__label {
    font-size: 1.2rem;
  }
  &__value {
    font-size: 1.2rem;
    margin-top: 10px;
  }
  &__link {
    margin-top: 20px;
    text-decoration: underline;
    font-size: 1.2rem;
    text-align: center;
    cursor: pointer;
    margin-bottom: 40px;
    margin-top: 40px;
  }
  @media screen and (min-width: 768px) {
    max-width: 78rem;
    margin: auto;
    border-bottom: 1px solid var(--border-gray);
    &__item {
      display: flex;
      margin-top: 0;
      border-top: 1px solid var(--border-gray);
    }
    &__label {
      padding: 3rem;
      min-width: 20rem;
      background-color: var(--light-color);
    }
    &__value {
      margin-top: 0;
      padding: 3rem;
    }
    &__link {
      color: var(--secondary-color);
    }
  }
}
pre {
  width: 100%;
  white-space: pre-line;
  font-family: Axis Std, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo,
}
</style>
