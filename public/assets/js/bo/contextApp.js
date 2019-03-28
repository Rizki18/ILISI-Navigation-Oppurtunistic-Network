class contextApp{
    constructor(){
        this.savedPolygons = [];
        this.savedPoi = [];
        this.mainPolygons = [];
        this.areaContour = null;
        this.mainLocation = null;
        this.mainTrajet = null;
        this.rankColors = [
            {color:'#d2ff4d',opacity:0.3},
            {color:'#ffdb4d',opacity:0.25},
            {color:'#ff794d',opacity:0.2},
            {color:'#ff3333',opacity:0.15},
            {color:'#b30000',opacity:0.1},
            {color:'#330000',opacity:0.08}
        ]
    }

    razAll(){
        this.savedPolygons.forEach(polygon =>{
            polygon.setMainMap(null);
        });

        this.savedPoi.forEach(poi =>{
            poi.setMainMap(null);
        });

        if(this.areaContour) this.areaContour.setMainMap(null);    
        this.savedPolygons = [];
        this.savedPoi = [];
        this.mainPolygons = [];
    }

    setAreacontour(zone){
        this.areaContour = zone;
    }

    radius(location,map){
        var paths = [],p=360/30,d=0;
        
        for(var i=0;i<30;++i,d+=p){
            paths.push(google.maps.geometry.spherical.computeOffset(location,200,d));
        }
        Singleton.getInstance().areaContour  = new Polygon(paths,'#ff3333',null,0.09,map); 
      
    }


    
}
