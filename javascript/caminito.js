var map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.87078378632823, lng: -122.30097999999998},
    zoom: 10,
  });


}


$(document).ready(function(){

    function toggleBounce() {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    }

    function trailMap(data){
        console.log(data);
        let lat = data.data.center.lat;
        let lng = data.data.center.lng;
       
        let map = new google.maps.Map(document.getElementById('map'), {
            zoom: 10,
            center: {lat: lat, lng: lng},
            //mapTypeId: 'terrain'
        });

        let coords = data.data.points

        let trailFencing = new google.maps.Polygon({
            paths: coords,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35
          });
          trailFencing.setMap(map);

          var trails_coords = [ {lat: 37.87078378632823, lng: -122.30097999999998}, {lat:37.8822, lng: -122.2336}, {lat:37.8695, lng:-122.2451} ]

         
          
        
          for (let i = 0; i < trails_coords.length; i++)
          {
          
                marker = new google.maps.Marker({
                map: map,
                draggable:false,
                animation: google.maps.Animation.Drop,
                    position: trails_coords[i]               
                })
            marker.addListener('click', toggleBounce);
          }

          infoWindow = new google.maps.InfoWindow;

          var pos = {};
          // Try HTML5 geolocation.
          if (navigator.geolocation) {
           navigator.geolocation.getCurrentPosition(function(position) {
             pos = {
               lat: position.coords.latitude,
               lng: position.coords.longitude
             };
       
             infoWindow.setPosition(pos);
             infoWindow.setContent('Location found.');
             infoWindow.open(map);
             map.setCenter(pos);
             myVar = setTimeout(calculateDistance, 3000, pos, trails_coords);
             
             
            
           }, function() {
             handleLocationError(true, infoWindow, map.getCenter());
           });
         } else {
           // Browser doesn't support Geolocation
           handleLocationError(false, infoWindow, map.getCenter());
         }
       
       
         function handleLocationError(browserHasGeolocation, infoWindow, pos) {
           infoWindow.setPosition(pos);
           infoWindow.setContent(browserHasGeolocation ?
                                 'Error: The Geolocation service failed.' :
                                 'Error: Your browser doesn\'t support geolocation.');
           infoWindow.open(map);
         }



        function calculateDistance(pos, trails_coords){
            

            lat1 = pos.lat; // current latitude and longitude 
            lon1 = pos.lng
            results = []
            for(let i = 0; i < trails_coords.length; i++){
                lat2 = trails_coords[i].lat;
                lon2 = trails_coords[i].lng;
                var R = 6371e3; // metres
                var φ1 = toRadians(lat1);
                var φ2 = toRadians(lat2);
                var Δφ = toRadians(lat2-lat1);
                var Δλ = toRadians(lon2-lon1);
        
                var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                
                var d = R * c;
                results.push(d)
            
            }
            console.log(results)

            var shortestPath = Math.min.apply(null, results)
            
           console.log(shortestPath)
    
    
            function toRadians(Value) {
                /** Converts numeric degrees to radians */
                return Value * Math.PI / 180;
            }
    

            $(".shortestPath").text("Closest Trail: " + (shortestPath * 3.28084) + " ft");
            
            //alert(shortestPath)
            


            //return shortestPath;
        }


        

        

        
       




    }

    
        
    $.ajax({
        url: "https://api.fencer.io/v1.0/geofence/e32a07be-6121-42a6-889b-e4b53a1120e5",
        headers: {"Authorization": "09210aab-f185-5a58-83a8-baa9b039f6f2"}
    }).done(function(data){
        console.log(data);
        trailMap(data);
        //setInterval(trailMap, 3000, data);
       
    })

    var APIKey ="d5777e749506c611ef0281015140b218";

    var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?" +
    "q=berkeley,us&units=imperial&appid=" +
    APIKey;

    $.ajax({
        url: queryURL,
        method: "GET"
      })

      .then(function(response) {
        // Log the queryURL
        console.log(queryURL);

        // Log the resulting object
        console.log(response);

        // Transfer content to HTML
        $(".city").html("<h1>" + response.name + " Weather Details</h1>");
        $(".wind").text("Wind Speed: " + response.wind.speed);
        $(".humidity").text("Humidity: " + response.main.humidity);
        $(".temp").text("Temperature (F) " + response.main.temp);

        // Log the data in the console as well
        console.log("Wind Speed: " + response.wind.speed);
        console.log("Humidity: " + response.main.humidity);
        console.log("Temperature (F): " + response.main.temp);
      });
   

})
