<template>
  <div>
    <el-link :underline="false" @click="onChangeAvatarClick">
      <el-image
        style="width: 100px; height: 100px"
        :src="brand_avatar"
        fit="contain"
        @error="$event.target.src = defaultLogo"
      />
    </el-link>
    <my-upload
      ref="refCrop"
      :model-value="isShowCrop"
      field="img"
      :width="300"
      :height="300"
      img-format="png"
      lang-type="en"
      type="file"
      accept="image/*"
      :url="urlBaseApi"
      @change="selectedFile"
      @crop-success="cropSuccess"
      @crop-upload-success="cropUploadSuccess"
      @crop-upload-fail="cropUploadFail"
      @update:modelValue="offDialogUpload"
    />
  </div>
</template>
<script>
import myUpload from 'vue-image-crop-upload'
import ManageBrandResource from '@/api/manage_supplier/brand'
const urlBaseApi = process.env.VUE_APP_BASE_API_SUPPLIER

const manageBrandResource = new ManageBrandResource()
const MAX_SIZE = 5000000
const MAX_WIDTH = 500
const MAX_HEIGHT = 300

export default {
  name: 'UploadCropImage',
  components: { 'my-upload': myUpload },
  props: {
    isShowCrop: {
      type: Boolean,
      default: false
    },
    imgDefault: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      brand_avatar: '',
      is_new_avatar: false,
      image: {
        size: 0,
        width: 0,
        height: 0
      },
      imageError: '',
      defaultLogo: 'https://vcallid.s3.ap-southeast-1.amazonaws.com/defaul.png', // require('@/assets/defaul.png'),
      urlBaseApi: `${urlBaseApi}/post_cdn`
    }
  },
  created() {
    this.$on('handle_add_new_brand', () => {
      this.handle_update_image_s3()
    })
  },
  mounted() {
    if (this.imgDefault) {
      this.brand_avatar = this.imgDefault
    }
  },
  methods: {
    selectedFile() {
      this.imageError = ''
      const file = this.$refs.refCrop.files.pop()

      console.log('..............chon file la : ', file)

      if (!file || file.type.indexOf('image/') !== 0) return
      this.image.size = file.size
      if (this.image.size > MAX_SIZE) {
        this.imageError = `The image size (${this.image.size}) is too much (max is ${MAX_SIZE}).`
        return
      }

      const reader = new FileReader()

      reader.readAsDataURL(file)
      reader.onload = (evt) => {
        const img = new Image()
        img.onload = () => {
          this.image.width = img.width
          this.image.height = img.height
          console.log(this.image)
          if (this.image.width > MAX_WIDTH) {
            this.imageError = `The image width (${this.image.width}) is too much (max is ${MAX_WIDTH}).`
            return
          }
          if (this.image.height > MAX_HEIGHT) {
            this.imageError = `The image height (${this.image.height}) is too much (max is ${MAX_HEIGHT}).`
            return
          }
        }
        img.src = evt.target.result
      }

      reader.onerror = (evt) => {
        console.error(evt)
      }
    },
    handleUploadImageSuccess(response, file) {
      console.log('..............upload image success', response, file)
      // const object = { ...response, ...{ remove: 0 }}
      // this.$emit('onSetUrlImage', object)
      // this.dialogImageUrl = response.name
    },
    onChangeAvatarClick() {
      this.isShowCrop = true
    },
    offDialogUpload(value) {
      console.log('........................off popup', value)
      this.isShowCrop = value
    },
    cropSuccess(brand_avatar, field) {
      console.log('-------- crop success --------', field)
      this.isShowCrop = false
      this.brand_avatar = brand_avatar
      this.is_new_avatar = true
    },
    cropUploadSuccess(jsonData, field) {
      console.log('-------- upload success --------')
      console.log(jsonData)
      console.log('field: ' + field)
    },
    cropUploadFail(status, field) {
      console.log('-------- upload fail --------')
      console.log(status)
      console.log('field: ' + field)
    },
    trigger_error(msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'error'
      })
    },
    convert_base64(base64Image) {
      const base64String = base64Image.replace(/^data:image\/\w+;base64,/, '')
      const byteCharacters = atob(base64String)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      return byteArray
    },
    handle_update_image_s3() {
      if (this.is_new_avatar) {
        const blob = new Blob([this.convert_base64(this.brand_avatar)], {
          type: 'image/jpeg'
        })
        const formData = new FormData()
        formData.append('image', blob, 'image.jpg')

        manageBrandResource
          .uploadImage(formData)
          .then((response) => {
            console.log(response, '............upload image')
            if (response.error === 0) {
              return response.name
            }
            throw new Error('Failed to upload image')
          })
          .then((image_url) => {
            console.log('emitting update_brand_avatar', image_url)
            this.$root.$emit('update_brand_avatar', image_url)
            this.brand_avatar = image_url
          })
          .catch((error) => {
            console.error('Error uploading image:', error)
            this.trigger_error('An error occur')
            this.$root.$emit('update_brand_avatar', this.imgDefault ? this.imgDefault : null)
          })
      } else {
        this.$root.$emit('update_brand_avatar', this.imgDefault ? this.imgDefault : null)
        // this.update_info(formUpdateUser);
      }
    }
  }
}
</script>
<style scoped>
.box-img {
  height: 100px;
  width: 100px;
}
</style>

