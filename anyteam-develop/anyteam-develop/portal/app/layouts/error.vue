<template>
  <div class="error__wrap flex flex-col justify-center align-items-center">
  	<font-awesome-icon class="error__icon" icon="exclamation-circle"/>
    <h1 class="error__code">{{ error.statusCode }}</h1>
    <Button v-on:click.native="toTopPage">トップへ</Button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ErrorResponse } from '~/interfaces/response/error';
import Button from '../components/common/Button.vue';

@Component({
	name: 'Error',
	layout: 'error',
	head() {
		return {
			title: 'Error',
		}
	},
	components: {
		Button,
	},
})
export default class ErrorLayout extends Vue {
	@Prop({default: {statusCode: 500, message: 'An error occurred!'}}) error!: ErrorResponse;

	toTopPage() {
		this.$router.push({name: 'index'});
	}
}
</script>

<style lang="scss">
.error {
	&__wrap {
		height: 50rem;
	}

	&__icon {
		font-size: 5rem !important;
		color: var(--gray);
	}

	&__code {
		font-size: 10rem;
		color: var(--dark-blue);
	}
}
</style>