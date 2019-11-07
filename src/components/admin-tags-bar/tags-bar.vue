<template>
	<div class="root">		
		<div class="root tags-bar-component">
			<added-tag
				title="added"
				name="added"/>
			<deleted-tag
				title="deleted"
				name="deleted"/>
			<all-tag
				title="all"
				name="all"/>
			<unsorted-tag
				title="unsorted"
				name="unsorted"/>
			<tag
			v-for="item in tags"
			:title="item.title"
			:name="item.name"/>
			<update/>
		</div>		
	</div>
</template>

<script>
	import addedTag from './added-tag.vue';
	import deletedTag from './deleted-tag.vue';
	import allTag from './all-tag.vue';
	import unsortedTag from './unsorted-tag.vue';
	import tag from './tag.vue';
	import update from '../update.vue';

	export default {
		computed: {
			tags() {
				return [{title: 'hi', name: 'hi'}, {title: 'ow', name: 'ow'}]
			}
		},
		components: {
			addedTag,
			deletedTag,
			allTag,
			unsortedTag,
			tag,
			update,
		}
	}
</script>

<style scoped>
	.tags-bar-component {
	    text-align: center;
	    border-bottom: 1px solid #ddd;
	    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	}
</style>