<template>
	<div class="vue-root-component">
		<tags-bar/>
		<popup-tags/>
	</div>
</template>

<script>
    import tagsBar from './components/admin-tags-bar/tags-bar.vue';
    import popupTags from './components/admin-tags-bar/popup-tags.vue';

	export default {
		components: {
			tagsBar,
			popupTags
		}
	}	
</script>

<style>	
	body {
		margin: 0;
	}
</style>