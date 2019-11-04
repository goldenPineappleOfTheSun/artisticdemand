<template>
	<div class="root" v-on:click="click">
	</div>
</template>

<script>	
	export default {
		methods: {
			click() {
				//let diff = {};
				var promise = Promise.resolve()
					.then(() => {
						return this.$root.$store.dispatch('loadAllPicturesFromAlbum');
					})
					.then(() => {
						return this.$root.$store.dispatch('loadAllPictures');
					}).then(() => {
						//diff = this.$root.$store.getters.diff;
						let diff = findDiff(this.$root.$store.state.albumPictures, this.$root.$store.state.pictures);
						debugger;
						return this.$root.$store.dispatch('uploadPictures', diff.added);
					});
			}
		}
	}

	function findDiff(albumPictures, pictures) {
    	let result = {
    		added: [],
    		updated: []
    	}
    	debugger;
    	for (var i in albumPictures){
    		let item = albumPictures[i];
    		if (!pictures[item.id]) {
    			result.added.push(item);
    		}
    	}
    	return result;
	}
</script>

<style>
	.root {
		width: 100px;
		height: 100px;
		background: #000;
	}
</style>