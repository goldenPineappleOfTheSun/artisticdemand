export default {
	props: {
			title: String,
			name: String
		},
		data() {
			return {
			}
		},
		computed: {
			style() {
				return {
				}
			},
			isActive() {				
				return this.$store.state.tags[this.name];
			}
		},
		methods: {
			click() {
				this.$store.commit('toggleTag', this.name);
			}
		},
		created() {
			this.$store.commit('appendTag', this.name);
		}
}