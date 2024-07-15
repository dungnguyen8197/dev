<template>
	<div>
		<select v-on:change="updateRegion">
			<option value="">全国</option>
			<option v-for="region in regions" v-bind:key="region.id" v-bind:value="region.id">{{ region.name }}</option>
		</select>
	</div>
</template>

<script lang="ts">
import {Component, Emit, Vue} from "vue-property-decorator";
import { getRegionGroups } from "~/api/regions";
import { getRegionsFromGroups } from "~/helpers/regions";
import { Region } from "~/interfaces/response/region";


@Component
export default class RegionSelect extends Vue {
	regions = [] as Region[];

	async created() {
		try {
			const res = await getRegionGroups();
			this.regions = getRegionsFromGroups(res.groups);
		} catch (e) {}
	}

	@Emit("updateRegion")
	updateRegion(e: Event): string {
		return (e.target as HTMLSelectElement).value;
	}
}
</script>

<style lang="scss" scoped>
select {
	font-size: 1.6rem;
	-webkit-appearance: none;
  -moz-appearance: none;
	padding-right: 2rem;
	border: none;
	outline: none;
	background: transparent;
	background-image: url("~/static/icons/arrow-down.svg");
	background-repeat: no-repeat;
  background-position-x: 100%;
  background-position-y: 5px;
	color: var(--dark-blue);
	cursor: pointer;
}
</style>