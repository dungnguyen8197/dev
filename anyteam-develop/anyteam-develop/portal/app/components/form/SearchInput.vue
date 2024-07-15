<template>
  <form class="search flex justify-center align-items-center" v-on:submit="updateInput">
    <input type="text" v-bind:placeholder="placeholder" class="search__input" v-model="value">
    <Button class="search__button" type="submit">{{ buttonText }}</Button>
  </form>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from "vue-property-decorator";
import Button from "~/components/common/Button.vue";

@Component({
  components: {
    Button,
  }
})
export default class SearchInput extends Vue {
  @Prop(String) readonly placeholder!: string;
  @Prop(String) readonly buttonText!: string;

  value = '';

  @Emit('updateInput')
  updateInput(event: Event): string {
    event.preventDefault();
    return this.value;
  }
}
</script>

<style lang="scss" scoped>
.search {
  background-color: var(--light-gray);
  margin-bottom: 2rem;
  padding: 1.5rem;
  &__input {
    outline: none;
    border: none;
    width: 30rem;
    height: 3.6rem;
    padding: 1rem 2rem;
    border-bottom-left-radius: 4px;
    border-top-left-radius: 4px;
    color: var(--dark-blue);

    @media screen and (max-width: 576px) {
      width: 18rem;
    }

    &::placeholder {
      color: var(--dark-blue);
      opacity: 0.5;
    }
  }

  &__button {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
    width: 8.8rem;
    height: 3.6rem;
  }
}
</style>
