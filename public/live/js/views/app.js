/*global define*/
define([
  'jquery',
  'underscore',
  'backbone',
  'd3',
  'common',
  'text!templates/nav.html',
  'text!templates/client-history.html'
], function ($, _, Backbone, d3, Common, navTemplate, clientTemplate) {
  'use strict';

  var AppView = Backbone.View.extend({
    el: 'body',

    // UI Events
    events: {
      'click #btn-add-node': 'addNode',
      'click #btn-remove-node': 'removeNode',
      'mouseover .network': 'showClients',
      'mouseout .network': 'hideClients',
      'mouseover .client circle': 'showClient',
      'mouseout .client circle': 'hideClient',
      'click .sidebar li a': 'navClick',
      'click .node.network': 'showNetworkInfo',
      'click .ssid-search .submit': 'searchDevices',
      'keyup .ssid-input': 'keyPressEventHandler',
      'click .swapView a': 'swapViewEvent',
      'click .modal-close': 'closeModal',
      'click .modal-overlay': 'closeModal',
      'click .sidebar_offense': 'offense',
      'click .sidebar_defense': 'defense',
      'click a.client-spoof': 'clientSpoof',
      'click a.client-crack': 'clientCrack'
    },

    initialize: function() {
      this.createVisContainer();
      this.$el.append(navTemplate);

      var height = $('.sidebar-list').height();
      var width = $('.sidebar-list').width();

      $('.sidebar-list').css({
        'position': 'fixed',
        'margin-top': -height/2,
        'top': '50%',
        'left': '0'
      });

      // Listen to collection events
      this.listenTo(this.collection, 'sync', this.render);
      // this.listenTo(this.collection, 'change', this.change);
      // this.listenTo(this.collection, 'add', this.createNode);

      this.collection.fetch();
      this.buildCount = 0;
      this.activeClient = '';
    },

    render: function() {
      var that = this;

      this.parseData(function(data) {
        that.build(data);
      });
    },

    parseData: function(callback) {
      console.log('Parsing data');
      
      var data = {
        name: "Probe",
        children: []
      }

      // Iterate through models and create a clean data set
      _.each(this.collection.models, function(item, index) {
        data.children.push(item.attributes);

        // Check if we're on the last model in the collection
        if (index === this.collection.models.length-1) {
          this.currentData = data;
          callback(data);
        }
      }, this);

    },

    createVisContainer: function() {
      console.log('Create vis container');

      this.diameter = 860;

      this.tree = d3.layout.tree()
          .size([360, this.diameter / 2 - 120])
          .separation(function(a, b) {
              return (a.parent == b.parent ? 1 : 2) / a.depth;
          });

      this.diagonal = d3.svg.diagonal.radial()
          .projection(function(d) {
              return [d.y, d.x / 180 * Math.PI];
          });

      this.svg = d3.select("#data")
          .append("svg")
          .attr("width", this.diameter)
          .attr("height", this.diameter)
          .append("g")
          .attr("transform", "translate(" + this.diameter / 2 + "," + this.diameter / 2 + ")");

    },

    build: function(data) {
      console.log('Update visual');

      var that = this;

      // Check if we've built more than once
      if (this.buildCount > 0) {
        // Remove all the nodes and links
        this.svg.selectAll('.node').remove()
        this.svg.selectAll('.link').remove()
      }

      // Generate nodes and links from data
      var nodes = this.tree.nodes(data),
          links = this.tree.links(nodes);

      // References to elements
      var link = this.svg.selectAll(".link").data(links)
      var node = this.svg.selectAll(".node").data(nodes)


      // Create links     
      link
        .enter()
        .append("path")
        .attr("class", function(d) {
          if (d.source.name === "Probe") {
            return 'link link-probe'
          } else if (d.children === undefined) {
            return 'link link-client'
          } else if (d.children) {
            return 'link link-network'
          }
        })
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
        .attr("d", this.diagonal);
  
      // Create nodes
      var nodeEnter = node
          .enter()
          .append("g")
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
          .attr("data-active", function(d) {
            if (d.name && d.name === that.activeClient) {
              return 'true';
            } else {
              return 'false';
            }
          })

      // Create probes, networks, and clients
      nodeEnter
        .append("circle")
        .attr("r", function(d) {
          if (d.name === "Probe") {
            return '5';
          } else if (d.children === undefined) {
            return '2.5'
          } else if (d.children) {
            return '4'
          }
        });

      // Create text for nodes
      nodeEnter
        .append("text")
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

      // Update build count
      this.buildCount++

    },

    addNode: function() {
      console.log('add node');

      // Fake data set
      var json = {
          BSSID : "02:13:5a",
          children : [ {
            name : "04:1A:3A:24:D9:5C"
          },{
            name : "04:1B:3A:24:D9:5C"
          },{
            name : "04:12:3A:24:D9:5C"
          } ],
          encryption : "WPA2 WPA AES-CCM TKIP",
          name : "yolo"
        }

      this.currentData.children.push(json)
      this.build(this.currentData);
    },

    removeNode: function() {
      this.currentData.children.splice(0,1)
      this.build(this.currentData);
    },

    showClients: function(e) {
      var id = $(e.target).parent('.network').attr('data-id'),
          clients = $('.client[data-id=' + id +']');

      clients.children('text').fadeIn();
    },

    hideClients: function(e) {
      var id = $(e.target).parent('.network').attr('data-id'),
          clients = $('.node.client[data-id=' + id +']');

      clients.children('text').fadeOut();
    },

    navClick: function(e) {
      var el = $(e.target).parent('li');

      // Route to method from item class
      switch (el.attr('class')) {
        case 'sidebar_search':
          if (el.attr('data-state') === 'open') {
            this.hideSearch(el);
          } else {
            this.showSearch(el);
          }
          
        break;
      }
    },

    showSearch: function(el) {
      console.log('Show search');

      el.find('span').text('Close');
      el.attr('data-state', 'open');

      $('.ssid-search').fadeIn(100);
      $('.ssid-search input[type="text"]').focus();
    },

    hideSearch: function(el) {
      console.log('Hide search');

      el.find('span').text('Search');
      el.attr('data-state', 'closed');
      
      $('.ssid-search').fadeOut(100, function() {
        $('.ssid-input').val('');
      });
    },

    showClient: function(e) {
      $(e.target).next('text').fadeIn();
    },

    hideClient: function(e) {
      $(e.target).next('text').fadeOut();
    },

    offense: function() {
      // var clients = d3.selectAll('.node.client')
      // clients.transition().duration(5000).attr('opacity', '0.1');

      this.svg.selectAll('.node.client').remove();
      this.svg.selectAll('.link-client').remove();
    },

    defense: function() {
      var that = this;

      _.each(this.currentData.children, function(item, index) {

        for (var i=0; i<2; i++) {
          var obj = {
            name: that.generateMac(),
            children: []
          };

          that.currentData.children[index].children.push(obj);
        }
        

        if (index === this.currentData.children.length-1) {
          this.build(this.currentData);
        }
      }, this);
    },

    showNetworkInfo: function(e) {
      var that = this,
          el = $(e.target).parent('.node.network'),
          data = el.attr('data-id').replace(/-/g,':');

      // Find matching data set
      _.find(this.currentData.children, function(item) {
        if (item.BSSID === data) {
          $('.network-bssid').text(item.bssid);
          $('.network-name').text(item.name);

          $('.modal-client-list li').remove();
          $('.modal-client-list .client-history').remove();
          $('.network-signal').removeClass('signal-1 signal-2 signal-3 signal-4');

          var ranSignal = Math.floor(Math.random() * (5 - 1) + 1);
          $('.network-signal').addClass('signal-' + ranSignal);

          var that = this;

          $.each(item.children, function(index, item) {
            var li = $('<li />'),
                actions = $('<a class="client-crack">Crack</a><a class="client-spoof">Spoof</a>'),
                mac = $('<div />').attr('class','client-mac').text(item.name).append(actions),
                clients = that.createClientHistory(),
                listItem = li.append(mac).append(clients);

            $('.modal-client-list').append(listItem);

          });
          
          that.showModal();
        }
      }, this)
    },

    createClientHistory: function() {
      var ranClients = Math.floor(Math.random() * (10 - 1) + 1),
          clientElements = $(clientTemplate).filter('.client-history'),
          compiled = [];

      for (var i=0; i<ranClients; i++) {
        var ran = Math.floor(Math.random() * (clientElements.length - 1) + 1);
        compiled.push(clientElements[ran]);
      }

      return compiled;
    },

    showModal: function() {
      $('body').addClass('state-modal-open');
      $('.modal-view').fadeIn(200);
    },

    closeModal:function() {
      $('body').addClass('state-modal-closed');
      $('.modal-view').fadeOut(200);
    },

    searchDevices: function() {
      var that = this,
          query = $('.ssid-input').val();

      // Match client
      $('.node.client text').each(function(index, element) {
        if ($(element).text() == query) {
          var parent = $(element).parent('.client');
          parent.attr('data-active','true');
          that.activeClient = query;
          console.log(that.activeClient);
        }
      });

      // Match network
      var exp = query.replace(/:/g,'-');
      $('.node.network[data-id="' + exp + '"]').attr('data-active','true');
    },

    keyPressEventHandler: function(e){
      e.preventDefault();
      if(event.keyCode == 13){
        this.searchDevices(e);
      }
    },

    swapViewEvent: function(e) {
      var el = $(e.target).parent('.swapView');

      if (el.attr('data-active') != 'true') {
        
        if (el.hasClass('sidebar_networks')) {
          this.setActiveNav(el);
          this.setActiveView(el);
        }
        if (el.hasClass('sidebar_maps')) {
          this.setActiveNav(el);
          this.setActiveView(el);
        }
      }
    },

    setActiveNav: function(el) {
      console.log('Set active nav');

      $('.swapView').each(function(index, element) {
        $(element).attr('data-active', 'false')
      });

      $(el).attr('data-active', 'true');
    },

    setActiveView: function(el) {
      console.log('Set Active View');

      var currentActive = $('.container').attr('data-active'),
          target = $(el).attr('class').replace('swapView sidebar_','');

      $('.container').attr('data-active', target);
      $('body').attr('data-active', target);

      $('.subview-' + currentActive).fadeOut(function() {
        $('.subview-' + target).fadeIn(function() {

          if (target == 'maps') {
            // $('#street-view').animate({
            //   'right': '-100px'
            // });
            console.log('maps');
          }
        });
      });
    },

    clientSpoof: function() {
      alert("Spoof");
    },

    clientCrack: function() {
      alert("Crack");
    },

    generateMac: function (){
      var hexDigits = '0123456789ABCDEF',
          macAddress='';

      for (var i=0; i<6; i++) {
          macAddress+=hexDigits.charAt(Math.round(Math.random()*16));
          macAddress+=hexDigits.charAt(Math.round(Math.random()*16));
          if (i != 5) macAddress+=":";
      }

      return macAddress;
    }


  });

  return AppView;
});