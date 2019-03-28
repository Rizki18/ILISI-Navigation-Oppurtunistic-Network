
class VoronoiDiagram{
    constructor(map,location){
        this.voronoiPolygons = [];
        this.mainMap = map;
        this.onLocation = location;
    }

    createDiagramFromPoints(voronoiPoints){
        this.CorrectMe(voronoiPoints);
        this.voronoiPolygons = d3.geom.voronoi(voronoiPoints);
    }

     VoronoiPointsCorrection() {
        var  width = 7000;var  height = 7000; var NORTH=0;  var WEST =-90;var SOUTH=180;var EAST=90;
        
        var north = google.maps.geometry.spherical.computeOffset(this.onLocation, height / 2, NORTH);
        var south = google.maps.geometry.spherical.computeOffset(this.onLocation, height / 2, SOUTH);
        var northEast = google.maps.geometry.spherical.computeOffset(north, width / 2, EAST);
        var northWest = google.maps.geometry.spherical.computeOffset(north, width / 2, WEST);
        var southEast = google.maps.geometry.spherical.computeOffset(south, width / 2, EAST);
        var southWest = google.maps.geometry.spherical.computeOffset(south, width / 2, WEST);
        //return [ northEast, northWest, southWest, southEast ];
        ///////////////////////////////////////////////////////////////////
        var paths = [],p=360/30,d=0;
        for(var i=0;i<30;++i,d+=p){
            paths.push(google.maps.geometry.spherical.computeOffset(this.onLocation,700,d));
        }
        return {corners:[northEast, northWest, southWest, southEast ],paths: paths};
    }

    
    CorrectMe(voronoiPoints) {

        if(Singleton.getInstance().areaContour) Singleton.getInstance().areaContour.setMap(null);
        var extra_points = this.VoronoiPointsCorrection();
        extra_points.corners.forEach(ep =>{
            var tmp = [ep.lng(),ep.lat()];
             voronoiPoints.push(tmp);
        });

        var cadreZone = new Polygon(extra_points.paths,'#ff3333',null,0.09,this.mainMap); 
        Singleton.getInstance().areaContour = cadreZone;
    }

    getVoronoiPolygons(){
        return this.voronoiPolygons;
    }
}