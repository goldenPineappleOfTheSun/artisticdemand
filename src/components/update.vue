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
						let added = findAdded(this.$root.$store.state.albumPictures, this.$root.$store.state.pictures);
						return added.length > 0
							? this.$root.$store.dispatch('uploadPictures', added)
							: false;
					}).then(() => {
						/* !in order to make multiple updates you need to specify allfields when sending list of updated */
						let album = this.$root.$store.state.albumPictures;
						let pics = this.$root.$store.state.pictures;
						let deleted = findDeleted(album, pics).map((x) => {
								return {id: x, status: 'd'}
							});

						debugger;

						return deleted.length > 0
							? this.$root.$store.dispatch('updatePictures', deleted)
							: false;
					});
			}
		}
	}

	/* albumPictures = object of vk pics, where key is pic' id and value is a pic */
	/* pictures = object of pg pics, where key is pic' id and value is a pic */
	/* returns array of added pictures */
	function findAdded(albumPictures, pictures) {
    	let result = [];
    	
    	for (var i in albumPictures){
    		let item = albumPictures[i];
    		if (!pictures[item.id]) {
    			result.push(item);
    		}
    	}
    	return result;
	}

	/* albumPictures = object of vk pics, where key is pic' id and value is a pic */
	/* pictures = object of pg pics, where key is pic' id and value is a pic */
	/* returns array of ids of deleted pictures */
	function findDeleted(albumPictures, pictures) {
		let result = [];
		for (var i in pictures){
    		let item = pictures[i];
    		if (item.status !== 'd' && !albumPictures[item.id]) {
    			result.push(item.id);    			
    		}
    	}
    	return result;
	}


	/* пока не надо статус обновляется на лету */
	/*function findUpdated(albumPictures, pictures) {
		let result = [];
		for (var i in pictures){
    		let item = pictures[i];
    		let vk = albumPictures[item.id];
    		if (!vk) continue;
    		if (vk.status != item.status) {
    			result.push(item.id);    			
    		}
    	}
    	return result;
	}*/
</script>

<style>
	.root {
		width: 100px;
		height: 100px;
		background: #000;
	}
</style>