<template>
	<div class="root" v-on:click="click">
	</div>
</template>

<script>	
	export default {
		methods: {
			click() {
				let diff = {};
				var promise = this.$root.$store.dispatch('loadAllPicturesFromAlbum') 
					.then(() => {
						this.$root.$store.dispatch('loadAllPictures');
					}).then(() => {
						diff = this.$root.$store.getters.diff;
						debugger;
						this.$root.$store.dispatch('uploadPictures', diff.added);
					});
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