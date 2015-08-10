var Plugins = {

  init: function() {

    function error(msg) {
      var s = document.querySelector('#status');
      s.innerHTML = typeof msg == 'string' ? msg : "failed";
      s.className = 'fail';
      
    }
    
    Plugins.createMaps();

    // Plugins.sizeMap();

    // $(window).resize(function() {Plugins.sizeMap()});
  },

  // sizeMap: function() {
  //   $('#street-view').css({height: $(window).height()});
  // },

 

  createMaps: function(coords) {
    var x = 34.129121,
        y = -118.148760,
        gcoords = new google.maps.LatLng(x, y),
        mapStyles = [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"off"},{"weight":"1.62"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}];

    // Create satellite map
    // TODO: need to show something else if street view isn't available
    Plugins.satelliteMap = new google.maps.Map(document.getElementById('satellite-view'), {
      center: gcoords,
      zoom: 15,
      draggable: false,
      scrollwheel: false,
      panControl: false,
      zoomControl: false,
      scaleControl: false,
      styles: mapStyles
    });

    Plugins.streetService = new google.maps.StreetViewService;
    Plugins.streetService.getPanoramaByLocation(gcoords, 10, function(StreetViewPanoramaData, StreetViewStatus) {

      Plugins.streetMap = new google.maps.StreetViewPanorama(document.getElementById('street-view'), {
        position: gcoords,
        pov: {
          heading: 72,
          pitch: 22
        }
      });
      // if (StreetViewStatus === 'ZERO_RESULTS') {
      //   var newPos = new google.maps.LatLng(34.0512342, -118.2436849);
      //   //34.0522342, -118.2436849
      //   Plugins.streetMap = new google.maps.StreetViewPanorama(document.getElementById('street-view'), {
      //     position: newPos,
      //     disableDefaultUI: true
      //     // panControl: false,
      //     // zoomControl: false,
      //     // mapTypeControl: false,
      //     // scaleControl: false,
      //     // streetViewControl: false,
      //     // overviewMapControl: false
      //   });

      //   //Plugins.satelliteMap.setCenter(newPos);
      // } else {
      //   Plugins.streetMap = new google.maps.StreetViewPanorama(document.getElementById('street-view'), {
      //     position: gcoords,
      //     disableDefaultUI: true
      //   });
      // }

      //Plugins.satelliteMap.setStreetView(Plugins.streetMap);

      if ($('body').attr('data-active') != 'maps') {
        $('.subview-maps').hide();
      }
      
    });

  },

  updateMaps: function(coords) {
    console.log('Updating maps');

    var gcoords = new google.maps.LatLng(coords.lat, coords.lng);
    console.log(gcoords);

    // Street View
    Plugins.streetMap.setPosition(gcoords);

    // Satellite Map
    Plugins.satelliteMap.setCenter(gcoords);

  }

};

$(document).ready(Plugins.init);