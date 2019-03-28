
    
    
    class MohammediaMap extends google.maps.Map{

        constructor(divId,zoom){
            var opts = new options();
            super(divId,{
                zoom:zoom,
                center: opts.CENTER,
                styles : opts.STYLE,
                restrictions: {
                    latLngBounds: opts.MEDIA_BOUNDS,
                    strictBounds: true,
                    }
                
                
            });
           
        }
        
        setPolygonsOnLocation(location){
            Singleton.getInstance().razAll();
            var self = this;
            var voronoiPoints = [];
            var voronoiPolygons = [];
            var voronoiDiagram = new VoronoiDiagram(self,location);
            var dum_path = [];
           d3.json('http://localhost:800/PoiMohammediaWebService/service.php', function (pointjson) {       
            
             var pointdata =  pointjson.results;
            self.focusOn(location); 
            Singleton.getInstance().radius(location,self);
            
            var poi_list = document.getElementById('resultsPoi');
            while (poi_list.firstChild) 
                poi_list.removeChild(poi_list.firstChild);
           
            pointdata.forEach(function (point) {
            
            if(Singleton.getInstance().areaContour.containsLocation(new PositionLatLng(point.geometry.location.lat,
                point.geometry.location.lng))){

                var dump_position = {lat: point.geometry.location.lat,lng:point.geometry.location.lng};
                var dump_poi = new PointInteret(dump_position,
                                        self,point.name,'http://maps.google.com/mapfiles/ms/icons/ltblue-dot.png',point.name);    
            
                var dump_voronoiPt = [dump_position.lng,dump_position.lat];                            
                  
                ////////////////////////////////////////
                //var li = document.createElement('li');
                var tr = document.createElement('tr');
                var td1 = document.createElement('td');
                var td2 = document.createElement('td');


                var details= document.createElement('input');
                details.setAttribute("type","submit");
                details.setAttribute("value","details");
                details.setAttribute("class","btn-info");
                details.addEventListener('click',function(){
                    google.maps.event.trigger(dump_poi, 'click');
                });
                var txt = document.createTextNode(point.name);
                td1.appendChild(txt);
                td2.appendChild(details);
                tr.appendChild(td1); tr.appendChild(td2);
                //li.appendChild(tr);
                document.getElementById('resultsPoi').appendChild(tr);
                ///////////////////////////////////////////////////////
                dump_poi.setInfoWindow(self); 
                Singleton.getInstance().savedPoi.push(dump_poi);
                voronoiPoints.push(dump_voronoiPt);  
             
            }});                         
            
            voronoiDiagram.createDiagramFromPoints(voronoiPoints);    
            voronoiPolygons = voronoiDiagram.getVoronoiPolygons();  
                  
            voronoiPolygons.forEach(voronoiPolygon =>{
                dum_path = [];
                voronoiPolygon.forEach(Pt =>{
                    dum_path.push({lat: Pt[1],lng: Pt[0]});
                });

                var polygon = new Polygon(dum_path,'#ff3300','grey',0.009,self);                              
                Singleton.getInstance().savedPolygons.push(polygon);

                });
            });
           
        }

        focusOn(location){
            this.setZoom(15);
            this.setCenter(location);
        }

         markNearestPoiFrom(location,name){
            
            Singleton.getInstance().mainPolygons = [];
             var mainLocation = new PointInteret(new PositionLatLng(location.lat(),location.lng()),this,
                    "",'http://maps.google.com/mapfiles/ms/icons/red-pushpin.png',name);

               
             Singleton.getInstance().savedPoi.push(mainLocation);
             for(var polygon of Singleton.getInstance().savedPolygons){
                if (polygon.containsLocation(location)){
                    polygon.setOptions({strokeWeight: 0.4, fillColor: '#4dff4d', fillOpacity: 0.4});
                    Singleton.getInstance().mainPolygons.push(polygon);
                    break;
                }
            }   
         }

          setExtraPolygons(){
              for(var rankColor of Singleton.getInstance().rankColors)
                this.setOtherPolygon(rankColor.color,rankColor.opacity)
          }

          setOtherPolygon(color,opacity) {
            var extra_edges = [];
            for (var polygon of Singleton.getInstance().mainPolygons)
                for (var edge of polygon.getPath().j)
                    extra_edges.push(edge);
        
            
            this.markNeighbour(extra_edges,color,opacity);
        }
        
        markNeighbour(edges,color,opacity){
            
            for (var polygon of Singleton.getInstance().savedPolygons) {
                for (var edge of polygon.getPath().j)
                    for (var mainEdge of edges)
                        if (edge.lat() == mainEdge.lat() && edge.lng() == mainEdge.lng() && Singleton.getInstance().areaContour.containsPolygon(polygon)
                             && !Singleton.getInstance().mainPolygons.includes(polygon)) {
                                 
                            polygon.setOptions({strokeWeight: 1, fillColor: color, fillOpacity: opacity});
                            Singleton.getInstance().mainPolygons.push(polygon);
                            break;
                        }
            }
        }
    }
   
  
