<template>
	<div class="root" v-on:click="click">
	</div>
</template>

<script>	
	export default {
		methods: {
			click() {
				this.$root.$store.dispatch('loadPicturesFromAlbum');
			}
		}
	}
</script>

<style>
	.root {
		width: 100px;
		height: 100px;
		background: #000;
	}
</style>