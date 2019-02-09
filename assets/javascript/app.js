console.log('Hello!');

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

    infoWindow = new google.maps.InfoWindow;
    var pos = {};
          
    // HTML5 geolocation.
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
             myVar = setTimeout(plot, 3000);
            
    }, function() {
    handleLocationError(true, infoWindow, map.getCenter());
    });
    } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
         }
       
       
         function handleLocationError(browserHasGeolocation, infoWindow, pos) {
            var queryURL =
            "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=Berkeley&term=trails"
            $.ajax({
                url: queryURL,
                method: "GET",
                headers: {
                    "Authorization": "Bearer 2rPfnvS7uPt4rnEx6UnP3nBx3lhnglcAa-eAQAofwcLm20stnuD-tpWGWNQWD3UCbes4LPYAwW0-XQqgt3QgrzI2BL_BMO54V_ZWbB49NqFBYNu86UWDMND866BYXHYx"
                }, 
                dataType: "json", 
                success: function(response){
                    // Log the queryURL
                   
                    let trails_coords = [];
                    // Transfer content to HTML
                    for(let i = 0; i < response.businesses.length; i++){
                        $("#trailmix").append("<tr><td>" + response.businesses[i].name + "</td><td>" + response.businesses[i].location.address1 + "</td><td>"
                         + Math.floor(response.businesses[i].distance * .0006)  + " " + "miles" + "</td><td>" + response.businesses[i].rating + "</td><td><img src='" + response.businesses[i].image_url  + "'/></td>"  + "</tr>")
                    }    
                }
            })
            infoWindow.setPosition(pos);

            // alert("I KNOW YOU DONT WANT ME TO KNOW WHERE YOU ARE")
            console.log("should animate");
            $('html, body').animate({
             scrollTop: $("#trails").offset().top
             }, 2000);
            //here we want the user to click the alert and be directed to list of trails, Mark suggested using
            //scrollDown
            

           infoWindow.setContent(browserHasGeolocation ?
                                 'Error: The Geolocation service failed.' :
                                 'Error: Your browser doesn\'t support geolocation.');


           infoWindow.open(map);
         }

         function plot(){
            var queryURL =
            "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=Berkeley&term=trails"
            
            //APIKey;    
    
            $.ajax({
                url: queryURL,
                method: "GET",
                headers: {
                    "Authorization": "Bearer 2rPfnvS7uPt4rnEx6UnP3nBx3lhnglcAa-eAQAofwcLm20stnuD-tpWGWNQWD3UCbes4LPYAwW0-XQqgt3QgrzI2BL_BMO54V_ZWbB49NqFBYNu86UWDMND866BYXHYx"
                }, 
                dataType: "json", 
                success: function(response){
                    // Log the queryURL
                    console.log(queryURL);
    
                    // Log the resulting object
                    console.log(response)
                    console.log(response.businesses[0].name);
                    let trails_coords = [];
                    // Transfer content to HTML
                    for(let i = 0; i < response.businesses.length; i++){
                        $("#trailmix").append("<tr><td>" + response.businesses[i].name + "</td><td>" + response.businesses[i].location.address1 + "</td><td>"
                         + Math.floor(response.businesses[i].distance * .0006)  + " " + "miles" + "</td><td>" + response.businesses[i].rating + "</td><td><img src='" + response.businesses[i].image_url  + "'/></td>"  + "</tr>")
                         let object = { lat: response.businesses[i].coordinates.latitude, lng: response.businesses[i].coordinates.longitude};
                         marker = new google.maps.Marker({
                            map: map,
                            draggable:false,
                            animation: google.maps.Animation.Drop,
                                position: object           
                            })
                        marker.addListener('click', toggleBounce);
                    }
                    //console.log(trails_coords)
                    
                }
            })
           
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

    //$.ajax({
        //url: "https://api.yelp.com/v3/businesses/search/",
        //headers: {"Client ID": "rlzfxkSifHgZlDcTLULJdw"}})

        //var APIKey ="2rPfnvS7uPt4rnEx6UnP3nBx3lhnglcAa-eAQAofwcLm20stnuD-tpWGWNQWD3UCbes4LPYAwW0-XQqgt3QgrzI2BL_BMO54V_ZWbB49NqFBYNu86UWDMND866BYXHYx";
  
    $.ajax({
        url: "https://api.fencer.io/v1.0/geofence/e32a07be-6121-42a6-889b-e4b53a1120e5",
        headers: {"Authorization": "09210aab-f185-5a58-83a8-baa9b039f6f2"}}).done(function(data){
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
        $(".city").html("<h1>" + response.name + " Weather Today");
        $(".wind").text("Wind Speed: " + response.wind.speed);
        $(".humidity").text("Humidity: " + response.main.humidity);
        $(".temp").text("Temperature (F) " + response.main.temp);

        // Log the data in the console as well
        console.log("Wind Speed: " + response.wind.speed);
        console.log("Humidity: " + response.main.humidity);
        console.log("Temperature (F): " + response.main.temp);
      });

    
 //WEEKLY FORECAST CODE
    var APIKey ="d5777e749506c611ef0281015140b218";

    var queryURL1 =
    "https://api.openweathermap.org/data/2.5/forecast?" + "q=Berkeley,us&units=imperial&appid=" +
    APIKey;

    $.ajax({
        url: queryURL1,
        method: "GET"
      })

      .then(function(response1) {
        // Log the queryURL
        console.log(queryURL1);

        // Log the resulting object
        console.log(response1);
        console.log(response1.list[0].main.humidity);

        // Transfer content to HTML
        $(".city1").html("<h1>" + response1.city.name + " Forecast Details</h1>");
        let fiveDayForcast = [];
        // Transfer content to HTML
        for(let i = 0; i < response1.list.length; i++){
            $("#forecast").append("<tr><td>" + response1.list[i].dt_txt + "</td><td>" + response1.list[i].main.temp + "</td><td>"
            + response1.list[i].main.temp_max  + "</td><td>" + response1.list[i].main.temp_min +  
            "</td><td>" + response1.list[i].weather[0].description  + "</td></tr>")
             
        }
       
      });
});


 


