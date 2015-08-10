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
			console.log(data);

			var diameter = 960;

      var tree = d3.layout.tree()
          .size([360, diameter / 2 - 120])
          .separation(function(a, b) {
              return (a.parent == b.parent ? 1 : 2) / a.depth;
          });


      var diagonal = d3.svg.diagonal.radial()
          .projection(function(d) {
              return [d.y, d.x / 180 * Math.PI];
          });

      var svg = d3.select("#data").append("svg")
          .attr("width", diameter)
          .attr("height", diameter)
          .append("g")
          .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");


      var nodes = tree.nodes(data),
          links = tree.links(nodes);

          var link = svg.selectAll(".link")
              .data(links)
              .enter().append("path")
              .attr("class", "link")
              .attr("data-id", function(d) {
                if (d.source.name === "Probe") {
                  return;
                } else if (d.children === undefined) {
                  var id = d.source['BSSID'].replace(/:/g,'-');
                  return id;
                } else if (d.children) {
                  var id = d.source['BSSID'].replace(/:/g,'-');
                  return id;
                }
              })
              .attr("d", diagonal);

          var node = svg.selectAll(".node")
              .data(nodes)
              .enter().append("g")
              .attr("class", function(d) {
                if (d.name === "Probe") {
                  return "node probe";
                } else if (d.children === undefined) {
                  return "node client";
                } else if (d.children) {
                  return "node network";
                }
              })
              .attr("data-id", function(d) {
                if (d.name === "Probe") {
                  return;
                } else if (d.children === undefined) {
                  var id = d.parent['BSSID'].replace(/:/g,'-');
                  return id;
                } else if (d.children) {
                  var id = d['BSSID'].replace(/:/g,'-');
                  return id;
                }
              })
              .attr("transform", function(d) {
                  return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
              })

          node.append("circle")
              .attr("r", function(d) {
                if (d.name === "Probe") {
                  return '5';
                } else if (d.children === undefined) {
                  return '2.5'
                } else if (d.children) {
                  return '4'
                }
              })

          node.append("text")
              .attr("dy", ".31em")
              .attr("text-anchor", function(d) {
                  return d.x < 180 ? "start" : "end";
              })
              .attr("transform", function(d) {
                  return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)";
              })
              .text(function(d) {
                  return d.name;
              });



      d3.select(self.frameElement).style("height", diameter - 150 + "px");


      setTimeout(function() {
      	// nodes.splice(1,1);
      	// links.shift();
      	// links.pop();
      	start();
      }, 2000)




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