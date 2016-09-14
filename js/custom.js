  //Hotels [Name, Lng, Lat, Desc.]
  var hotels = [
        ]

  function initAutocomplete() {
      var infowindow = new google.maps.InfoWindow();
      //Map
      var map = new google.maps.Map(document.getElementById('map'), {
          center: {
              lat: 33.4
              , lng: -117.6
          }
          , zoom: 12
          , mapTypeId: 'roadmap'
      });
      // Layer with all the hotel location markers
      var ctaLayer = new google.maps.KmlLayer({
          //need to host kml file on public server which google can search for
          url: 'http://max-peng.com/HBD29.kml'
          , map: map
      });
      // Try HTML5 geolocation.
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function (position) {
              var pos = {
                  lat: position.coords.latitude
                  , lng: position.coords.longitude
              };
              map.setCenter(pos);
              map.setZoom(12);
          }, function () {
              handleLocationError(true, infoWindow, map.getCenter());
          });
      }
      else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
      }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
          infoWindow.setPosition(pos);
          infoWindow.setContent(browserHasGeolocation ? 'Error: The Geolocation service failed.' : 'Error: Your browser doesn\'t support geolocation.');
      }
      //Code use if markers in hotels array
      function placeMarker(loc) {
          var LatLng = new google.maps.LatLng(loc[1], loc[2]);
          var marker = new google.maps.Marker({
              position: LatLng
              , map: map
          });
          google.maps.event.addListener(marker, 'click', function () {
              infowindow.close;
              infowindow.setContent(loc[3]);
              infowindow.open(map, marker);
          })
      }
      for (var i = 0; i < hotels.length; i++) {
          placeMarker(hotels[i]);
      }
      // Create the search box and link it to the UI element.
      var input = document.getElementById('pac-input');
      var searchBox = new google.maps.places.SearchBox(input);
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
      // Bias the SearchBox results towards current map's viewport.
      map.addListener('bounds_changed', function () {
          searchBox.setBounds(map.getBounds());
      });
      var markers = [];
      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
      searchBox.addListener('places_changed', function () {
          var places = searchBox.getPlaces();
          if (places.length == 0) {
              return;
          }
          // Clear out the old markers.
          markers.forEach(function (marker) {
              marker.setMap(null);
          });
          markers = [];
          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function (place) {
              if (!place.geometry) {
                  console.log("Returned place contains no geometry");
                  return;
              }
              var icon = {
                  url: place.icon
                  , size: new google.maps.Size(71, 71)
                  , origin: new google.maps.Point(0, 0)
                  , anchor: new google.maps.Point(17, 34)
                  , scaledSize: new google.maps.Size(25, 25)
              };
              if (place.geometry.viewport) {
                  // Only geocodes have viewport.
                  bounds.union(place.geometry.viewport);
              }
              else {
                  bounds.extend(place.geometry.location);
              }
          });
          map.fitBounds(bounds);
      });
  }