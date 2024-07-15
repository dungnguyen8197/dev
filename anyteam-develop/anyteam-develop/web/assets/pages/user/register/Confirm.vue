<template>
  <div class="register__confirm">
    <div class="section-container mt-24">
      <PageTitle v-bind:title="'会員登録'" is-center></PageTitle>
    </div>
    <div class="auth-container">
      <div class="confirm__content">
        <div class="confirm__content-title">メールを確認いただき、<br>会員手続きを完了してください。</div>
        <div class="confirm__content-description">本文に記載のURLから会員登録をしてください。<br>メールが届かない場合は以下ご確認ください。</div>
        <div class="flex justify-center items-center">
          <ul class="confirm__content-note">
            <li>登録のメールアドレスが間違えてないか</li>
            <li>「@anyteam.jp」からのメール受信を許可設定されているか</li>
            <li>迷惑メールフォルダにメールが届いていないか</li>
          </ul>
        </div>
        <div class="confirm__button">
          <SubmitButton
            :active="active"
            v-bind:label="'トップに戻る'"
            :handleClick="back"
          />
        </div>
      </div>
    </div>
    <Footer class="pc-tablet-only" />
  </div>
</template>

<script lang="ts">
import SubmitButton from '../../../components/form/SubmitButton.vue';
import PageTitle from '../../../components/common/page/PageTitle.vue';
import { defineComponent } from '@vue/runtime-core';
import Footer from '../../../components/Footer.vue';

export default defineComponent({
  components: { SubmitButton, PageTitle, Footer },
  
  setup() {
    const back: any = () => {
      window.location.href　= '/';
    }
    const active: boolean = true;
    return {
      back,
      active
    }
  }
});
</script>

<style lang="scss" scoped>
.confirm {
  &__button {
    margin-top: 6rem;
  }
  &__title {
    font-size: 1.8rem;
    line-height: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
  }

  &__content{
    text-align: center;
    &-title {
      font-size: 1.8rem;
      line-height: 2.4rem;
      margin-top: 7rem;
      margin-bottom: 8rem;
    }
    &-description {
      font-size: 1.6rem;
      font-size: 1.4rem;
      line-height: 1.8rem;
      margin-bottom: 2.6rem;
    }

    &-note {
      font-size: 1rem;
      line-height: 1.8rem;
      li { 
        text-align: left;
      }
    }
  }
}
</style>