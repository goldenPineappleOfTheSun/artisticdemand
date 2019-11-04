import Vue from 'vue';
import Vuex from 'vuex';
import $ from 'jquery';
import mainVue from './main.vue';
import 'babel-polyfill';
import _ from 'lodash';

// todo
// переменная занят, чтоб несколько действий не накладывалось
// проверка на сбои нодджс
// в index.js/uploadphotos проверять, чтоб этот запрос вызывался не чаще, чем раз в 300 мс

Vue.use(Vuex);

const store = new Vuex.Store({
    strict: true,    
    state: {
        albumPictures: {}, // pictures from vk
        albumLoader: {
        	batchsize: 200,
        	offset: 0,
        	count: 0,
        	processing: false, // if true then its needed to wait a little
        	more: true // true if no more photos
        },
        postgresLoader: {
        	batchsize: 1000,
        	offset: 0,
        	count: 0,
        	processing: false, // if true then its needed to wait a little
        	more: true // true if no more photos
        },
        pictures: {}, // pictures from postgres
	    filter: {
	    	added: true,
	    	removed: true
	    }
    },
    getters: {
    	/*diff(state) {
    		let result = {
    			added: [],
    			updated: []
    		}
    		debugger;
    		for (var i in state.albumPictures){
    			let item = state.albumPictures[i];
    			if (!state.pictures[item.id]) {
    				result.added.push(item);
    			}
    		}
    		return result;
    	}*/
    },
    mutations: {
    	albumPictures(state, val) {
    		val.forEach(x => {
    			Vue.set(state.albumPictures, x.id, x);
    		})
    	},
    	albumLoader(state, val) {
    		Vue.set(state.albumLoader, 'more', val.more || state.albumLoader.more);
    		Vue.set(state.albumLoader, 'offset', val.offset || state.albumLoader.offset);
    		Vue.set(state.albumLoader, 'count', val.count || state.albumLoader.count);
    	}, 	
    	albumLoaderIsProcessing(state, val) {
    		Vue.set(state.albumLoader, 'processing', val);
    	}, 
    	pictures(state, val) {
    		val.forEach(x => {
    			Vue.set(state.pictures, x.id, x);
    		})
    	},
    	postgresLoader(state, val) {
    		Vue.set(state.postgresLoader, 'more', val.more || state.postgresLoader.more);
    		Vue.set(state.postgresLoader, 'offset', val.offset || state.postgresLoader.offset);
    		Vue.set(state.postgresLoader, 'count', val.count || state.postgresLoader.count);
    	}, 	
    	postgresLoaderIsProcessing(state, val) {
    		Vue.set(state.postgresLoader, 'processing', val);
    	}, 
    	newPicture(state, val) {    	
    		Vue.set(state.pictures, val.id, val);	
    		Vue.set(state.pictures[val.id], 'status', 'new');	
    	},
    	pictureStatus(state, val) {    		
    		var pic = state.pictures[val.pic.id];
    		if (!pic)
    			throw 'no such picture';
    		Vue.set(state.pictures[val.pic.id], 'status', val.status);	
    	}
    },
    actions: {    	
    	loadAllPicturesFromAlbum(context) {   
    		return new Promise((_resolve, _reject) => {	
	    		let loader = context.state.albumLoader;
	    		let promise = context.dispatch('loadPicturesFromAlbum');
	    		for (let i=0; i<=loader.count / loader.batchsize; i++){
	    			promise = promise.then(() => context.dispatch('loadPicturesFromAlbum'));
	    		}
	    		promise = promise.then(() => _resolve())
    		}) 	
    	},
    	loadPicturesFromAlbum(context) {
    		return new Promise((resolve, reject) => {
	    		let loader = context.state.albumLoader;
	    		context.commit('albumLoaderIsProcessing', true);
	    		$.ajax({
	    			url: '/loadvkphotos',
	    			method: 'get',
	    			contentType: 'application/json; charset=utf-8',
		   			data: `offset=${loader.offset}&count=${loader.batchsize}`,
	    			success(data) {
	    				context.commit('albumLoader', {
	    					count: data.count, 
	    					more: data.more, 
	    					offset: loader.offset + loader.batchsize
	    				});
	    				context.commit('albumPictures', data.items);
	    				context.commit('albumLoaderIsProcessing', false);  
	    				resolve();
	    			},
	    			error(data) {
	    				context.commit('albumLoaderIsProcessing', false);
	    				resolve();
	    			}
	    		})
	    	})
    	},
    	loadAllPictures(context) { 
    		return new Promise((_resolve, _reject) => {	   	
	    		let loader = context.state.postgresLoader;
	    		let promise = context.dispatch('loadPictures');
	    		for (let i=0; i < Math.floor(loader.count / loader.batchsize); i++){
	    			debugger;
	    			promise = promise.then(() => context.dispatch('loadPictures'));
	    		}
	    		promise = promise.then(() => _resolve())
	    	})
    	},
    	loadPictures(context) {
    		return new Promise((resolve, reject) => {
	    			debugger;
	    		let loader = context.state.postgresLoader;
	    		context.commit('postgresLoaderIsProcessing', true);
	    		$.ajax({
	    			url: '/loadpictures',
	    			method: 'get',
	    			contentType: 'application/json; charset=utf-8',
		   			data: `offset=${loader.offset}&count=${loader.batchsize}`,
	    			success(data) {
	    				context.commit('postgresLoader', {
	    					count: +data.count, 
	    					offset: loader.offset + loader.batchsize
	    				});
	    				context.commit('pictures', data.items);
	    				context.commit('postgresLoaderIsProcessing', false);  
	    				resolve();
	    			},
	    			error(data) {
	    				context.commit('postgresLoaderIsProcessing', false);
	    				resolve();
	    			}
	    		})
	    	})
    	},
    	uploadPictures(context, items) {    		
    		return new Promise((resolve, reject) => {
	    		let chunks = _.chunk(items, 64);
	    		let promise = Promise.resolve();
	    		debugger;
	    		for (var i=0; i<chunks.length; i++) {
	    			let copy = chunks[i];
	    			promise = promise.then(() => sendChunk(copy));
	    			promise = promise.then(() => new Promise((_resolve) => setTimeout(() => {_resolve()}, 500)));
	    		}	    		
	    	})

	    	function sendChunk(chunk) {
		    				//debugger;	
	    		return new Promise((resolve, reject) => {
		    			$.ajax({
		    			url: '/uploadpictures',
		    			method: 'post',
		    			contentType: 'application/json; charset=utf-8',
			   			data: JSON.stringify(chunk),
		    			success(data) {
		    				debugger;	    				
		    				resolve();    				
		    			},
		    			error(data) {	    				
		    				resolve();
		    			}
		    		})
	    		})
	    	}
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

//async function _load