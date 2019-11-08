<template>
	<div class="popup-fog-component root" :style="style" @click="popupClose">
		<div class="popup-window">
			<div class="popup-window__close" @click="popupClose">X</div>
			<div class="popup-window-view">
				
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
			}
		},
		methods: {
			popupClose(event) {
				if (event.target === event.currentTarget)
					this.$store.commit('closePopup');
			},
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
		top: 200px;
		transform: translate(-50%, 0);
		width: 100px;
		height: 100px;
		padding: 10px;
		border-radius: 3px;
		background: #fff;
	}

	.popup-window__close {
		position: absolute;
		right: 10px;
		top: 10px;
		cursor: pointer;
	}
</style>