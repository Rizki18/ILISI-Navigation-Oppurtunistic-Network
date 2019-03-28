
class PointInteret extends google.maps.Marker{
    constructor(position,map,title,icon,name){
        super({
            position: position,
            map: map,
            title: title,
            
            icon:  {
              url: icon,
            size: new google.maps.Size(32, 38),
            labelOrigin: new google.maps.Point(35, 35)
        }});
        this.name = name;
        this.map = map;
    }

    setMainMap(map){
        this.setMap(map)
     }

     getLatLng(){
       return this.position;
     }
     setInfoWindow(map){
        
        google.maps.event.addListener(this, 'click', function() {
          swal(this.name, {
            buttons: {
              cancel: "Cancel",
              catch: "Plus",
              defeat: "Show the way",
            },
          })
          .then((value) => {
            switch (value) {
           
              case "defeat": {
                 var selectList = document.createElement("select");
                 selectList.id = "mySelect";
                 selectList.class = "form-control form-control-lg"
                 var option1 = document.createElement("option");
                 option1.value = "DRIVING";
                 option1.text = "DRIVING";
                 selectList.appendChild(option1);
                 var option2 = document.createElement("option");
                 option2.value = "WALKING";
                 option2.text = "WALKING";
                 selectList.appendChild(option2); 
                 swal({
                content: selectList,
                icon: 'travelmode-logo.jpg',
                buttons: {
                  cancel: "Cancel",
                  catch : "Marquer"
                 }
                }).then((value)=> {
                  switch(value){
                    case "catch" : {
                       var trajet = new Trajet(this.getLatLng(),Singleton.getInstance().mainLocation,
                       document.getElementById('mySelect').value,this.map);
                       trajet.Create(); 
                      
                       if( Singleton.getInstance().mainTrajet)
                        Singleton.getInstance().mainTrajet.setMap(null);
                       Singleton.getInstance().mainTrajet = trajet;
                      break;
                    }
                  }
                    
                });
                break;
              }                   
              
           
              case "catch":{
              
                new Services().getMatrixDistance(Singleton.getInstance().mainLocation,this.getLatLng());
                
                var distance = document.getElementById('distance').value;
                var duration = document.getElementById('duration').value;
                var DirectionPt = Singleton.getInstance().savedPoi[Singleton.getInstance().savedPoi.length-1];
                swal(this.name+"=>"+DirectionPt.name, "Distance : "+distance+"\nDuration : "+duration, "info");
                break; 
            }
                
               
           
              default:
                exit;
            }
          });
        
            //infowindow.setContent('<div><strong>' + this.name + '</strong><br>');
            //infowindow.open(map, this);
        });
     }
}