import Vue from 'vue';
import Vuex from 'vuex';
import $ from 'jquery';
import _ from 'lodash';

Vue.use(Vuex);

const store = new Vuex.Store({
    strict: true,    
    state: {
    },
    mutations: {
    },
    actions: {   
    }
})

new Vue({
	store,
	el: '#app',
	render(h) {
    	return h(mainVue);
  	},
  	created() {
  		this.$store.commit('initSpecialTags');
  		this.$store.dispatch('loadTags');
  	}
})