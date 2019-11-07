<template>
	<div class="update-component root" v-on:click="click" :style="style">
		Синхронизировать с vk
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
</script>

<style>
	.update-component {
		display: inline-block;
		box-sizing: border-box;
	    margin: 10px;
	    padding: 5px 15px;
	    text-align: center;
	    color: white;
    	background: #868480;
	    cursor: pointer;
		transition: transform 0.2s ease-out;
	}

	.update-component:active {
		transform: scale(0.97, 0.97)
	}
</style>