<template>
  <div>
    <div class="login-intro">
      <h1 class="login-intro__title">ANYTEAM</h1>
      <p class="login-intro__description">部活支援プラットフォーム</p>
    </div>
    <Header v-if="isInitial === 1" v-bind:title="'ご登録までの流れ'" />
    <StepBar v-if="isInitial === 1" description="※ログインにはANYTEAMから発行された仮ID、パスワードが必要です" />
    <Header v-bind:title="'ログイン'" />
    <form id="login-form" class="form-container">
      <div v-if="error" class="form__error">{{ errorText }}</div>
      <Divider />
      <InputText
        class="px-2 px-md-6"
        v-on:handleInput="setEmail"
        v-bind:value="email"
        v-bind:label="'ID'"
        v-bind:inputId="'email'"
        v-bind:inputName="'email'"
        v-bind:placeholder="'未入力'"
        v-bind:validateRule="{email: true, required: true}"
      />
      <Divider />
      <InputText
        class="px-2 px-md-6"
        v-on:handleInput="setPassword"
        v-bind:value="password"
        v-bind:label="'パスワード'"
        v-bind:inputId="'password'"
        v-bind:inputName="'password'"
        v-bind:placeholder="'未入力'"
        v-bind:inputType="'password'"
        v-bind:validateRule="{required: true, minLength: 6, maxLength: 50}"
      />
      <Divider />
      <SubmitButton
        class="my-6"
        v-bind:label="'ログイン'"
        v-bind:handleClick="doLogin"
        v-bind:active="canSubmit"
      />
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Header from '../components/Header.vue'
import InputText from '../components/form/InputText.vue'
import SubmitButton from '../components/form/SubmitButton.vue'
import Divider from '~/components/common/Divider.vue';
import StepBar from '~/components/steps/StepBar.vue';
import { HTTPResponse } from '@nuxtjs/auth-next';
import { loginFailureMessage } from '~/api/messages';
import { InputTextEmit } from '~/interfaces/input-emit';

export default Vue.extend({
  layout: 'auth',
  name: 'Login',
  head() {
    return {
      title: 'ログイン'
    }
  },
  components: {
    Divider,
    Header,
    InputText,
    SubmitButton,
    StepBar
},
  data () {
    return {
      email: '',
      password: '',
      isLogin: false,
      error: false,
      errorText: loginFailureMessage,
      isProcess: false,
      canSubmit: false,
      isValid: {
        email: false,
        password: false,
      },
      isInitial: +this.$route.query.is_initial,
    }
  },
  methods: {
    setEmail($event: InputTextEmit): void {
      this.email = $event.value;
      this.isValid.email = $event.isValid;
      this.changeCanSubmit()
    },
    setPassword($event: InputTextEmit): void {
      this.password = $event.value;
      this.isValid.password = $event.isValid;
      this.changeCanSubmit()
    },
    changeCanSubmit(): void {
      this.canSubmit = this.isValid.email && this.isValid.password;
    },
    logout(): void {
      this.$auth.logout()
    },
    async doLogin(): Promise<void> {
      if (this.isProcess) return;
      let form = <HTMLInputElement>document.getElementById('login-form')
      form.classList.add('was-validated')

      try {
        if (form.checkValidity()) {
          this.isProcess = true;
          this.error = false;
          let loginInfo = {
            email: this.email,
            password: this.password
          }
          const res = await this.$auth.loginWith('local', {data: loginInfo}) as HTTPResponse;
          if (res!.data.is_temporary) {
            await this.$router.push({name: 'register-organization-users'});
            return;
          }

          if (this.$auth.user && this.$auth.user.is_group_user) {
            await this.$router.push({ name: 'organizations' });
            return;
          } else {
            await this.$router.push({
              name: 'organizations-organization_id', 
              params: { organization_id: this.$auth.user?.organization_id as string }
            });
            return;
          }

          this.isProcess = false;
        }
      } catch (e) {
        this.isProcess = false;
        this.error = true;
      }
    },
  }
})
</script>

<style lang="scss" scoped>
.form {
  &__error {
    color: var(--red);
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
}
.login-intro {
  position: fixed;
  top: 40px;
  left: 24px;
  @media screen and (max-width: 768px) {
    position: relative; 
  }
  &__title {
    font-size: 2.8rem;
    font-weight: 500;
    margin-bottom: 0;
  }
  &__description {
    font-size: 1.2rem;
    font-weight: 500;
    margin-top: 0.5rem;
  }
}
</style>
