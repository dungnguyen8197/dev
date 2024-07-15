<template>
  <div class="form-action">
    <button
      v-bind:class="{ deactive: !active }"
      @click="submit()"
      type="button"
    >
      {{ label }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

type Props = {
  active: Boolean;
  handleClick: any;
};

export default defineComponent({
  props: {
    active: {
      type: Boolean,
      required: true,
    },
    label: {
      type: String,
    },
    handleClick: {
      type: Function,
      required: true,
    },
  },
  setup(props: Props) {
    const submit = () => {
      if (!props.active) {
        return;
      }
      props.handleClick();
    };

    return { submit };
  },
});
</script>

<style lang="scss" scoped>
.form-action {
  max-width: 24rem;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1.6rem;

  button {
    cursor: pointer;
    //border: none;
    border: 1px solid var(--secondary-color);
    border-radius: 6px;
    width: 100%;
    height: 4.4rem;
    background-color: var(--secondary-color);
    color: #ffffff;
  }

  .deactive {
    border: 1px solid var(--dark-gray-color);
    background-color: var(--dark-gray-color);
    color: #ffffff;
  }
}
</style>
