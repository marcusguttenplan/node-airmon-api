/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'd3',
	'views/todos',
	'common'
], function ($, _, Backbone, d3, TodoView, Common) {
	'use strict';

	// Our overall **AppView** is the top-level piece of UI.
	var AppView = Backbone.View.extend({

		// Instead of generating a new element, bind to the existing skeleton of
		// the App already present in the HTML.
		el: '#data',

		// Delegated events for creating new items, and clearing completed ones.
		events: {
			'keypress #new-todo':		'createOnEnter'
		},

		initialize: function() {

			this.createTree();

			this.listenTo(this.collection, 'change', this.change);
			this.listenTo(this.collection, 'add', this.createNode);
			this.listenToOnce(this.collection, 'sync', this.createVisual);
			//this.listenTo(this.collection, 'all', this.createNode);

			this.collection.fetch();	
			//this.createVisual();		
			//console.log(this.collection);
		},

		render: function() {
		},

		createTree: function() {
		},

		createVisual: function() {
			console.log('Create visual');
			//console.log(this.collection);
			
			var data = {
				name: "Probe",
				children: []
			}

			//console.log(this.collection.models)

			_.each(this.collection.models, function(item, index) {
				data.children.push(item.attributes);

				if (index === this.collection.models.length-1) {
					this.build(data);
				}
			}, this);

		},

		build: function(data) {
			//console.log(data);
    var width = 660,
    height = 2200;

    this.cluster = d3.layout.cluster()
    .size([height, width - 160]);

    this.diagonal = d3.svg.diagonal()
    .projection(function(d) {
      return [d.y, d.x/2.5]; 
    });

    this.svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(40,0)");

    this.update(data);

    d3.select(self.frameElement).style("height", height + "px");

  },

  update: function(data) {

      this.nodes = this.cluster.nodes(data);
      this.links = this.cluster.links(this.nodes);

      //console.log(this.nodes);
      this.link = this.svg.selectAll(".link")
      this.node = this.svg.selectAll(".node");


      this.link.data(this.links)
      .enter().append("path")
      .attr("class", "link")
      .attr("d", this.diagonal);

      
      this.node = this.node.data(this.nodes)
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x /2.5+ ")"; })

      this.node.append("circle")
      .attr("r", 4.5);

      this.node.append("text")
      .attr("dx", function(d) { return d.children ? -8 : 8; })
      .attr("dy", 3)
      .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
      .text(function(d) { return d.name; });


      var that = this;

      var duration = 750,
          timer = setInterval(function() {
            console.log(that.nodes.length)

            that.nodes.splice(0,1);
            that.links.shift();
            that.links.pop();



          }, duration);
		},

		createNode: function(network) {
			//console.log(network.attributes);
			//console.log(this.collection)


		},


		change: function(network) {
			//console.log(network);
		},

		add: function(network) {
			//console.log(network);
		}



	});

	return AppView;
});