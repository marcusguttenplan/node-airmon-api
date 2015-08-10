/*global define*/
define([
	'underscore',
	'backbone'
], function (_, Backbone) {
	'use strict';

	var Network = Backbone.Model.extend({

		defaults: {
			title: '',
			completed: false
		}
		
	});

	return Network;
});