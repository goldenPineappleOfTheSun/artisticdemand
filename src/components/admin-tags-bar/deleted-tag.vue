<template>
	<div 
	v-bind:class="{
		'tag-component': true, 
		'deleted-tag-component': true, 
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
		mixins: [tagMixin],
		created() {
			this.name = 'deleted';
			this.title = 'deleted';
		}
	}
</script>

<style scoped>
	.tag-component {
	}
	.tag-component.is-active {
		background: #ea8681;
	}
</style>