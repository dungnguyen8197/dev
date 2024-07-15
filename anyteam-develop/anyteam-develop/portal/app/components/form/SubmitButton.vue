<template>
  <Button
    size="lg"
    v-bind:color="active ? 'primary' : 'gray' "
    @click.native="submit()"
  >
    {{ label }}
  </Button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Button from "~/components/common/Button.vue";
@Component({
  components: {Button}
})
export default class SubmitButton extends Vue {
  @Prop({ type: Boolean, default: false }) active!: boolean
  @Prop({ type: String }) label!: string
  @Prop({ type: Function, required: true }) handleClick!: Function

  submit() {
    if (!this.active) {
      return;
    }
    this.handleClick()
  }
}
</script>
