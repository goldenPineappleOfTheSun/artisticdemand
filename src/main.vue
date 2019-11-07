<template>
	<div class="vue-root-component">
		<tags-bar/>
	</div>
</template>

<script>
    import tagsBar from './components/admin-tags-bar/tags-bar.vue';

	export default {
		components: {
			tagsBar
		},
		/*computed: {
			albumPicture() {
				return this.$store.state.albumPictures;
			}
		}*/
	}	
</script>

<style>	
	body {
		margin: 0;
	}
</style>