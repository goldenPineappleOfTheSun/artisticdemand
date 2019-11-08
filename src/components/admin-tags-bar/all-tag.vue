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
				processing: null
			}
		},
		computed: {
			isActive() {
				if (this.processing !== null)
					return this.processing;

				for (let i in this.$store.state.tags) {
					let item = this.$store.state.tags[i];
					if (!item.isSpecial && item.state === false) {
						this.$store.commit('disableTag', this.name);
						return false
					}
				}				

				this.$store.commit('enableTag', this.name);
				return true;
			}
		},
		methods: {
			click() {
				this.processing = !this.$store.state.tags[this.name].state;
				let action = this.processing ? 'enableTag' : 'disableTag';
				this.$store.commit(action, this.name);

				for (let i in this.$store.state.tags) {
					let item = this.$store.state.tags[i];
					if (!item.isSpecial) {
						this.$store.commit(action, item.name);
					}
				}

				this.processing = null;
			}
		},
		created() {
			this.name = 'all';
			this.title = 'all';
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