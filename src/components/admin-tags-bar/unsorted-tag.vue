<template>
	<div 
	v-bind:class="{
		'tag-component': true, 
		'unsorted-tag-component': true, 
		'root': true, 
		'is-active':isActive}" 
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
		background: #9ec7d5;
	}
</style>