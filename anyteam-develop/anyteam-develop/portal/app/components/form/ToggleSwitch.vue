<template>
  <div>
    <label v-if="label" class="mr-1" @click="onClickLabel">{{ label }}</label>
    <label class="switch">
      <input ref="switch" type="checkbox" @change="onChange" v-bind:checked="checked">
      <span class="slider round"></span>
    </label>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop , Emit, Ref } from "vue-property-decorator";

@Component
export default class ToggleSwitch extends Vue {
  @Prop({ type: Boolean, default: false }) checked!: boolean;
  @Prop(String) label: string | undefined;

  @Ref("switch") switch!: HTMLInputElement;

  @Emit("change")
  onChange($event: Event): boolean {
    const target = $event.target as HTMLInputElement;
    return target.checked;
  }

  onClickLabel() {
    this.switch.click();
  }
}
</script>

<style lang="scss" scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 28px;
  height: 16px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--gray);
  -webkit-transition: .2s;
  transition: .2s;
  &:before {
    position: absolute;
    content: "";
    height: 14px;
    width: 14px;
    left: 1px;
    bottom: 1px;
    background-color: var(--white);
    -webkit-transition: .2s;
    transition: .2s;
  }
}



input:checked + .slider {
  background-color: var(--primary);
}

input:focus + .slider {
  box-shadow: 0 0 1px var(--primary);
}

input:checked + .slider:before {
  -webkit-transform: translateX(12px);
  -ms-transform: translateX(12px);
  transform: translateX(12px);
}

.slider.round {
  border-radius: 16px;
  &:before {
    border-radius: 50%;
  }
}
</style>
