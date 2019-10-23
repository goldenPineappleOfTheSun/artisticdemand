<template>
	<div class="vue-root-component">
		<update>			
		</update>
		<ul id="example-1">
			<li v-for="item in albumPicture">
				{{ item.id }}
			</li>
		</ul>
	</div>
</template>

<script>
    import update from './components/update.vue';

	export default {
		components: {
			update
		},
		computed: {
			albumPicture() {
				return this.$store.state.albumPictures;
			}
		}
	}	
</script>