<template>
	<div class="root">		
		<div class="root tags-bar-component">
			<added-tag/>
			<deleted-tag/>
			<all-tag/>
			<tag
			v-for="item in tags"
			:custom-title="item.title"
			:custom-name="item.name"/>
			<update/>
			<manage-tags/>
		</div>		
	</div>
</template>

<script>
	import addedTag from './added-tag.vue';
	import deletedTag from './deleted-tag.vue';
	import allTag from './all-tag.vue';
	import unsortedTag from './unsorted-tag.vue';
	import tag from './tag.vue';
	import update from '.././admin/update.vue';
	import manageTags from './manage-tags.vue';

	export default {
		computed: {
			tags() {
				let result = [];
				for (var i in this.$store.state.tags) {
					let item = this.$store.state.tags[i];
					if (!item.isSpecial) result.push(item);
				}
				return result;
			}
		},
		components: {
			addedTag,
			deletedTag,
			allTag,
			unsortedTag,
			tag,
			update,
			manageTags
		}
	}
</script>

<style scoped>
	.tags-bar-component {
		position: relative;
		left: 10%;
		width: 80%;
	    text-align: center;
	    border-bottom: 1px solid #ddd;
	    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	}
</style>