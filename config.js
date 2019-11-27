const _ = require('lodash');

let defaultconfig = {
	vk: {
		appid: '7157642'
	},
	pg: {
		connectionString: 'postgres://rzlcwyycehngbl:b08699220aad2e15484222299fd554df0b07b2284dca508f19244475e376d573@ec2-174-129-255-128.compute-1.amazonaws.com:5432/d10ivtjecumtra'
	}
}

let config = {
	production: {
		vk: _.clone(defaultconfig.vk),
		pg: _.clone(defaultconfig.pg)
	},
	development: {
		vk: _.clone(defaultconfig.vk),
		pg: _.clone(defaultconfig.pg)
	},
	test: {
		vk: _.clone(defaultconfig.vk),
		pg:  {
			connectionString: 'postgres://qbknwrmyzrvrzn:47cb0b60727950ead8538446d2b5400f85872497b606374ea5ab51ccd070b19f@ec2-46-137-120-243.eu-west-1.compute.amazonaws.com:5432/d1ucqbs3qmeta9'
		}
	}
}

module.exports = (config[process.env.NODE_ENV] || defaultconfig);