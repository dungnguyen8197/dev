<template>
  <div class="c-app">
    <CWrapper>
      <div class="c-body">
        <nuxt />
      </div>
    </CWrapper>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: {
  }
})
export default class AuthLayout extends Vue {
  
}
</script>