<template>
	<div class="manage-tags-component root" @click="click">
		Управление каталогами
	</div>
</template>

<script>
	export default {
		methods: {
			click() {
				this.$store.commit('openPopup');
			}
		}
	}
</script>

<style>
	.manage-tags-component {
		display: inline-block;
		box-sizing: border-box;
	    margin: 10px;
	    padding: 5px 15px;
	    text-align: center;
	    font-size: 0.8em;
	    color: white;
    	background: #868480;
	    cursor: pointer;
		transition: transform 0.2s ease-out;
	}

	.manage-tags-component:active {
		transform: scale(0.97, 0.97)
	}
</style>