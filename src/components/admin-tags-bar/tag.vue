<template>
	<div 
	v-bind:class="{
		'tag-component': true,
		'root': true, 
		'is-active':isActive}" 
	@click="click"
	:style="style">
		{{title}}
	</div>
</template>

<script>
	import tagMixin from './tag-mixin.js'

	export default {
		mixins: [tagMixin]
	}
</script>

<style>
	.tag-component {
		display: inline-block;
		margin: 10px;
		padding: 5px 15px;
		border-radius: 3px;
		text-align: center;
		background: #f3ede3;
		cursor: pointer;    
		transition: transform 0.2s ease-out;
	}

	.tag-component:active {
		transform: scale(0.9, 0.9)
	}
</style>

<style scoped>
	.tag-component {
		background: #e6ded0;
	}
	.tag-component.is-active {
		background: #ffc33e;
	}
</style>