'use strict';

require.config({
	shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: [
				'underscore',
				'jquery'
			],
			exports: 'Backbone'
		}
	},
	paths: {
		jquery: '../bower_components/jquery/jquery',
		underscore: '../bower_components/underscore/underscore',
		backbone: '../bower_components/backbone/backbone',
		text: '../bower_components/requirejs-text/text',
		firebase: '../bower_components/firebase/firebase',
		d3: '../bower_components/d3/d3',
		backbonefire: 'backbonefire'
	}
});

require([
	'backbone',
	'views/app',
	'routers/router',
	'collections/networks'
], function (Backbone, AppView, Workspace, Networks, Gmaps) {
	new Workspace();
	Backbone.history.start();

	// Initialize the application view
	new AppView({ collection: Networks });
});