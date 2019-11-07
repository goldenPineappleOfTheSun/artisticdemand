<template>
	<div 
	v-bind:class="{
		'tag-component': true, 
		'all-tag-component': true, 
		'root': true, 
		'is-active':isActive}" 
	@click="click"
	:style="style">
		{{title}}
	</div>
</template>

<script>
	import tagMixin from './tag-mixin.js';

	export default {
		mixins: [tagMixin],
		data() {
			return {
				process: null
			}
		},
		computed: {
			isActive() {
				if (this.process !== null)
					return this.process;

				let tags = this.$store.state.tags;
				let flag = tags[this.name];
				for (let item in tags) {
					if (item !== 'added' && item !== 'deleted' && item !== 'all' && tags[item] === false) {
						flag = false;
					}
				}				
				return flag;
			}
		},
		methods: {
			click() {
				this.process = !this.$store.state.tags[this.name];
				this.$store.commit('toggleTag', this.name);

				let tags = this.$store.state.tags;
				for (let item in tags) {
					if (item !== 'added' && item !== 'deleted' && item !== 'all') {
						let action = this.isActive ? 'enableTag' : 'disableTag';
						this.$store.commit(action, item);
					}
				}

				this.process = null;
			}
		}
	}
</script>

<style scoped>
	.tag-component {
	}
	.tag-component.is-active {
		background: #7bcae6;
	}
</style>