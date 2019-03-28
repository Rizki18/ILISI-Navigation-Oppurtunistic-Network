class Services {
    constructor(){}

    getMatrixDistance(origine,dest){               
        
        var directionsService = new google.maps.DirectionsService();          
        var request = {
            origin: origine,
            destination: dest,
            travelMode: google.maps.TravelMode.DRIVING, //WALKING, BYCYCLING, TRANSIT
            unitSystem: google.maps.UnitSystem.IMPERIAL
        };
    
        //pass the request to the route method
        directionsService.route(request, function (result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
              document.getElementById('distance').value = result.routes[0].legs[0].distance.text;  
              document.getElementById('duration').value = result.routes[0].legs[0].duration.text;
            }
        });
            
        }
}
