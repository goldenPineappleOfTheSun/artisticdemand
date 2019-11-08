<template>
	<div class="popup-fog popup-tags-component root" :style="style" @click="popupClose">
		<div class="popup-window">
			<div class="popup-window__close" >
				<img src="svg/close.svg" @click="popupClose">
			</div>
			<div class="popup-window-view">
				<ul>
					<li v-for="tag in tags">
						<div class="tag-badge">
							{{tag.title}}
						</div>		
						<div title="удалить" class="tag-delete" @click="deleteTag($event, tag.id)">
							<img src="svg/delete.svg">
						</div>				
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		computed: {
			style() {
				return {
					display: this.$store.state.isPopupOpened ? 'block' : 'none'
				}
			},
			tags() {
				let result = [];
				for (var i in this.$store.state.tags) {
					let item = this.$store.state.tags[i];
					if (!item.isSpecial && item.name !== 'unsorted') result.push(item);
				}
				return result;
			}
		},
		methods: {
			popupClose(event) {
				if (event.target === event.currentTarget)
					this.$store.commit('closePopup');
			},
			deleteTag(event, id) {
				console.log(id);
			}
		}
	}
</script>

<style scoped>
	.root {
		position: fixed;
		left: 0;
		top: 0;
		width: 100vw;
		width: 100%;
		height: 100vh;
		height: 100%;
		background: rgba(0,0,0,0.3);
		z-index: 1;
	}

	.popup-window {
		position: absolute;
		left: 50%;
		top: 200vh;
		top: 200px;
		transform: translate(-50%, 0);
		height: 100px;
		padding: 20px;
		border-radius: 3px;
		background: #fff;
	}

	.popup-window__close {
		position: absolute;
		right: 10px;
		top: 10px;
		width: 0.7rem;
		cursor: pointer;
	}

	ul {
		list-style-type: none;
		padding: 0;
	}

	.tag-badge {
		box-sizing: border-box;
		display: inline-block;
		margin: 10px 0;
	    background: #e6ded0;
	    padding: 5px;
	    cursor: pointer;
	}

	.tag-delete {
		position: relative;
		width: 1rem;
		display: inline-block;
		padding: 5px;
	    cursor: pointer;
	}

	.tag-delete img {
		width: 100%;
	}
</style>