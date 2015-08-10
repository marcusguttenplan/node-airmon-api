var Site = {

  init: function(options) {
    Site.firebase = new Firebase('https://reality-versioning.firebaseio.com/sandbox');
    Site.eventCount = 0;

    if (options.data !== 'live') {
      d3.json(options.data, Site.createVisual);
    } else {
      // TODO: real time mode
    }
    

    //Site.dataUpdateEvent();
    //Site.getData();

    function error(msg) {
      var s = document.querySelector('#status');
      s.innerHTML = typeof msg == 'string' ? msg : "failed";
      s.className = 'fail';
      
      // console.log(arguments);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(data) {
        Site.createMaps(data.coords)
      }, error);
    } else {
      error('not supported');
    }

    Site.sizeMap();

    $(window).resize(function() {Site.sizeMap()});
  },

  sizeMap: function() {
    $('#street-view').css({height: $(window).height()});
  },

  createVisual: function(json) {
    //console.log(json);
    var flower = new CodeFlower("#data-visual", $(window).width(), ($(window).height() - 55));
    flower.update(json);
    //console.log(json);

  },

  // getData: function() {
  //   Site.firebase.once('value', function(childSnapshot) {
  //     var data = childSnapshot.val();

  //     // Log some stuff
  //     console.log('First data event');
  //     console.log(data.coords);

  //     // Create maps
  //     Site.createMaps(data.coords);
  //     Site.eventCount++;
  //   });
    
  // },

  // dataUpdateEvent: function() {

  //   Site.firebase.on('value', function(childSnapshot) {

  //     // Make sure this isn't the first event
  //     if (Site.eventCount !== 0) {
  //       var data = childSnapshot.val();

  //       // Log some stuff
  //       console.log('Data event');
  //       console.log(data);

  //       // Update maps
  //       Site.updateMaps(data.coords);
  //       Site.eventCount++;
  //     }
      
  //   });
  // },

  createMaps: function(coords) {
    var gcoords = new google.maps.LatLng(coords.latitude, coords.longitude);
    var mapStyles = [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"off"},{"weight":"1.62"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}];

    // Create satellite map
    // TODO: need to show something else if street view isn't available
    Site.satelliteMap = new google.maps.Map(document.getElementById('satellite-view'), {
      center: gcoords,
      zoom: 15,
      draggable: false,
      scrollwheel: false,
      panControl: false,
      zoomControl: false,
      scaleControl: false,
      styles: mapStyles
    });

    Site.streetService = new google.maps.StreetViewService;
    Site.streetService.getPanoramaByLocation(gcoords, 10, function(StreetViewPanoramaData, StreetViewStatus) {

      if (StreetViewStatus === 'ZERO_RESULTS') {
        var newPos = new google.maps.LatLng(34.0522342, -118.2436849);

        Site.streetMap = new google.maps.StreetViewPanorama(document.getElementById('street-view'), {
          position: newPos,
          disableDefaultUI: true
        });

        Site.satelliteMap.setCenter(newPos);
      } else {
        Site.streetMap = new google.maps.StreetViewPanorama(document.getElementById('street-view'), {
          position: gcoords,
          disableDefaultUI: true
        });
      }

      Site.satelliteMap.setStreetView(Site.streetMap);
    });

    //google.maps.event.addListener(Site.streetMap, 'zoom_changed', function() {
      //console.log('wegwegewg');
    //});

    
  },

  updateMaps: function(coords) {
    console.log('Updating maps');

    var gcoords = new google.maps.LatLng(coords.lat, coords.lng);
    console.log(gcoords);

    // Street View
    Site.streetMap.setPosition(gcoords);

    // Satellite Map
    Site.satelliteMap.setCenter(gcoords);

  }

};