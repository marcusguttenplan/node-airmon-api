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
			//this.listenToOnce(this.collection, 'sync', this.createVisual);
			//this.listenTo(this.collection, 'all', this.createNode);

			this.collection.fetch();	
			//this.createVisual();		
			//console.log(this.collection);
		},

		render: function() {
			
		},

		createTree: function() {
	

var diameter = 960;

var tree = d3.layout.tree()
    .size([diameter - 20, diameter - 20]);

var root = {},
    nodes = tree(root);

root.parent = root;
root.px = root.x;
root.py = root.y;

 var diagonal = d3.svg.diagonal.radial()
          .projection(function(d) {
              return [d.y, d.x / 180 * Math.PI];
          });


var svg = d3.select("body").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
  .append("g")
    .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");


var node = svg.selectAll(".node"),
    link = svg.selectAll(".link");

var duration = 750,
    timer = setInterval(update, duration);


function update() {
  if (nodes.length >= 500) return clearInterval(timer);



  // Add a new node to a random parent.
  var n = {id: nodes.length},
      p = nodes[Math.random() * nodes.length | 0];
  

    if (p.children) {
    p.children.push(n);
    } else {
      p.children = [n];
    }
    
    nodes.push(n);



  // Recompute the layout and data join.
  node = node.data(tree.nodes(root), function(d) { return d.id; });
  link = link.data(tree.links(nodes), function(d) { return d.source.id + "-" + d.target.id; });

  // Add entering nodes in the parent’s old position.
  // node.enter().append("circle")
  //     .attr("class", "node")
  //     .attr("r", 4)
  //     .attr("cx", function(d) { return d.parent.px; })
  //     .attr("cy", function(d) { return d.parent.py; });

  node.enter().append("g")
              .attr("class", function(d) {
              	console.log(d);
                if (d.name === "Probe") {
                  return "node probe";
                } else if (d.children === undefined) {
                  return "node client";
                } else if (d.children) {
                  return "node network";
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

  // Add entering links in the parent’s old position.
  // link.enter().insert("path", ".node")
  //     .attr("class", "link")
  //     .attr("d", function(d) {
  //       var o = {x: d.source.px, y: d.source.py};
  //       return diagonal({source: o, target: o});
  //     });


link.enter().append("path")
              .attr("class", "link")
              .attr("d", diagonal);


  // Transition nodes and links to their new positions.
  var t = svg.transition()
      .duration(duration);

  t.selectAll(".link")
      .attr("d", diagonal);

  t.selectAll(".node")
      .attr("cx", function(d) { return d.px = d.x; })
      .attr("cy", function(d) { return d.py = d.y; });
}

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