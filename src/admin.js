import('babel-polyfill');
import Vue from 'vue';
import Vuex from 'vuex';
import $ from 'jquery';
import mainVue from './main.vue';

Vue.use(Vuex);

const store = new Vuex.Store({
    strict: true,
    state: {
        picturesFromAlbum: {},
        pictures: {}
    },
    mutations: {
    	picturesFromAlbum(state, val) {
    		state.picturesFromAlbum = val;
    	},
    	pictures(state, val) {
    		state.pictures = val;
    	}
    },
    actions: {
    	// loads pictures from vk and updates checks differences between bd and vk versions
    	async loadPicturesFromAlbum(context) {
    		// load from vk
    		await $.ajax({
    			url: '/loadvkphotos',
    			method: 'get',
    			success(data) {
    				context.commit('picturesFromAlbum', data);
    			}
    		})
    		// load from pg
    		await $.ajax({
    			url: '/loadpictures',
    			method: 'get',
    			success(data) {
    				context.commit('picturesFromAlbum', data);
    			}
    		})
    		// find diffs
    		let vkhash = context.state.picturesFromAlbum.map(x => ({id:x.id, status: '-'}));
    		let dbhash = context.state.pictures.map(x => ({id:x.id, status: '-'}))
    		vkhash.forEach(x => {
    			let found = dbhash[x.id];
    			if (!found) {dbhash.push({id:x.id, status:'n'})} // new
    			if (found) {found.status = 'g'} // good
    		})
    		// update pg
    		let picturestoupdate = [];
    		let picturestoinsert = [];
    		dbhash.forEach(x => {
    			let current = context.state.pictures[x.id];
    			if (!current) {
    				picturestoinsert.push(context.state.picturesFromAlbum[x.id]);
    			}
    			if (x.status !== current.status) {
    				picturestoupdate.push(current);
    			}
    		})
    		$.ajax({
    			url: '/updatepictures',
    			method: 'post',
    			data: {updates: picturestoupdate, inserts: picturestoinsert},
    			success(data) {
    				context.commit('picturesFromAlbum', data);
    			}
    		})
    	}
    }
})

new Vue({
	store,
	el: '#app',
	render(h) {
    	return h(mainVue);
  	}
})

