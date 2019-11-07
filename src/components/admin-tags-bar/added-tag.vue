<template>
	<div 
	v-bind:class="{
		'tag-component': true, 
		'added-tag-component': true, 
		'root': true, 
		'is-active': isActive}" 
	@click="click"
	:style="style">
		{{title}}
	</div>
</template>

<script>
	import tagMixin from './tag-mixin.js';

	export default {
		mixins: [tagMixin]
	}
</script>

<style scoped>
	.tag-component {
	}
	.tag-component.is-active {
		background: #bada55;
	}
</style>