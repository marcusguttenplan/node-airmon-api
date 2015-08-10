/*global define */
define([
	'underscore',
	'backbone',
	'models/network',
	'firebase',
	'backbonefire'
], function (_, Backbone, Network) {
	'use strict';

	var NetworksCollection = Backbone.Firebase.Collection.extend({
		// Reference to this collection's model.
		model: Network,

		// Save all of the todo items under the `"todos"` namespace.
		url: 'https://reality-versioning.firebaseio.com/data/children'
		//url: 'https://reality-versioning.firebaseio.com/sandbox/data/children'
	});

	return new NetworksCollection();
});