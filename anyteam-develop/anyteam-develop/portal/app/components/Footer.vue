<template>
  <footer></footer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class Footer extends Vue {}
</script>

<style lang="scss" scoped>
footer {
  height: 10rem;
}
</style>
