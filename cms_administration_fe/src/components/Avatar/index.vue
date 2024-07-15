<template>
  <el-avatar class="image-avatar" :size="60" :src="avatarPath" @error="errorHandler">
    <img :src="avatarPathDefault">
  </el-avatar>
</template>

<script>
export default {
  name: 'ElAvatarCustom',
  props: {
    avatarPath: {
      type: String,
      default: null
    },
    avatarPathDefault: {
      type: String,
      default: null
    }
  },
  methods: {
    errorHandler() {
      return true
    }
  }
}
</script>

<style lang="scss">
.el-avatar {
  img {
    width: 100%;
  }
}
</style>
