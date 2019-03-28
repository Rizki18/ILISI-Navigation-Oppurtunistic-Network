
    $(document).ready(function() {
        
          var appContext  = new contextApp(); 
           var myMap = new MohammediaMap(document.getElementById('map'),15);
           var input = document.getElementById('pac-input');
           var searchBox = new google.maps.places.SearchBox(input);
           myMap.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
       
           myMap.addListener('zoom_changed', function() {

            Singleton.getInstance().savedPoi.forEach(poi=>{  
                if(myMap.getZoom() > 15) {   console.log("changed+"+myMap.getZoom());
                  poi.setLabel( { 
                   
                    text: '  '+poi.getTitle(),
                    color: "#4682B4",
                    fontSize: "10px",
                    fontWeight: "bold"
                  });
                }
                  else{
                      console.log("changed-"+myMap.getZoom());
                    poi.setLabel("");
                  }
                  
            });
        });
           



           searchBox.addListener('places_changed', function() {
       
               if (input.value == "") {
                   alert("Vous devez saisissez l'endroit que vous chercher");
                   return;
               }
               var mainPlace = searchBox.getPlaces()[0];
               Singleton.getInstance().mainLocation = mainPlace.geometry.location;
               myMap.setPolygonsOnLocation(mainPlace.geometry.location);
       
               setTimeout(function(){ 
                                       myMap.markNearestPoiFrom(Singleton.getInstance().mainLocation,mainPlace.name);
                                        myMap.setExtraPolygons(); 
                                       },720);
               
           });
     
       
    });



