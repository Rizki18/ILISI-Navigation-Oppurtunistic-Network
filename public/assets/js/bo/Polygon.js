
class Polygon extends google.maps.Polygon{
    constructor(path,sColor,fColor,fOpacity,map){
        super({
         paths: path,
         strokeColor: sColor,
         strokeOpacity: 0.5,
         strokeWeight: 2,
         fillColor: fColor,
         fillOpacity: fOpacity
     });
     
     this.setMap(map);
    }

    setMainMap(map){
        this.setMap(map)
     }

    

    containsLocation(position){
     return google.maps.geometry.poly.containsLocation(position,this);
    }

    containsPolygon(polygon){
     for(var edge of polygon.getPath().j)
         if(!this.containsLocation(new PositionLatLng(edge.lat(),edge.lng())))
         return false;
     return true;
    }
 }