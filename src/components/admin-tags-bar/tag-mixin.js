export default {
	props: {
			customTitle: String,
			customName: String
		},
		data() {
			return {
				title: this.customTitle,
				name: this.customName,
			}
		},
		computed: {
			style() {
				return {
				}
			},
			isActive() {			
				return this.$store.state.tags[this.name].state;
			}
		},
		methods: {
			click() {
				this.$store.commit('toggleTag', this.name);
			}
		},
		/*created() {
			this.$store.commit('appendTag', this.name);
		}*/
}