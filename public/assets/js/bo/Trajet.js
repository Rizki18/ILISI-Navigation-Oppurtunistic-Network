class Trajet{
    
constructor(origine,dest,travelMode,map){
     this.origine = origine;
     this.dest = dest;
     this.travelMode = travelMode;
     this.directionsDisplay = new google.maps.DirectionsRenderer();
     this.directionsDisplay.setMap(map);
    }

    Create(){
        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setMap(this.map);
        var request = {
            origin: this.origine,
            destination: this.dest,
            travelMode: google.maps.TravelMode[this.travelMode]
        };

        var self = this;
        directionsService.route(request, function(response, status) {
            if (status == 'OK') {
                console.log("ok");
             self.directionsDisplay.setDirections(response);
            }
          });

    }

    setMap(m){
        this.directionsDisplay.setMap(m);
    }

}