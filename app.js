function initMap() {
  // Map option

  var options = {
    center: { lat: 38.346, lng: -0.4907 },
    zoom: 10,
  };

  //
  //New Map
  map = new google.maps.Map(document.getElementById("map"), options);

  //listen for click on map location

  google.maps.event.addListener(map, "click", (event) => {
    //add Marker
    addMarker({ location: event.latLng });
  });

  function addMarker(property) {
    const marker = new google.maps.Marker({
      position: property.location,
      map: map,
      //icon: property.imageIcon
    });

    // Check for custom Icon

    if (property.imageIcon) {
      // set image icon
      marker.setIcon(property.imageIcon);
    }

    if (property.content) {
      const detailWindow = new google.maps.InfoWindow({
        content: property.content,
      });

      marker.addListener("mouseover", () => {
        detailWindow.open(map, marker);
      });
    }
  }

  let current_lat = map.getCenter().lat();
  let current_lng = map.getCenter().lng();

  function showLocation() {
    document.getElementById("lat").textContent = current_lat;
    document.getElementById("lng").textContent = current_lng;
  }

  showLocation();

  infoWindow = new google.maps.InfoWindow();
  const locationButton = document.createElement("button");
  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          //make a link of the current location
          console.log(position.coords.latitude);
          console.log(position.coords.longitude);
          current_lat = position.coords.latitude;
          current_lng = position.coords.longitude;
          showLocation();

          infoWindow.setPosition(pos);
          infoWindow.setContent("Location found.");
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });

  map.addListener("click", function (e) {
    getClickLatLng(e.latLng, map);
  });

  function getClickLatLng(lat_lng) {
    // 座標を表示
    current_lat = lat_lng.lat();
    current_lng = lat_lng.lng();
    showLocation();
  }

  const mapLink = document.querySelector("#map-link");
  const shareButton = document.getElementById("shareBtn");
  shareButton.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition((position) => {
      mapLink.href = `https://maps.google.com/?ll=${current_lat},${current_lng}`;
      mapLink.textContent = `https://www.google.com/maps/${current_lat},${current_lng}`;
    });
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}
