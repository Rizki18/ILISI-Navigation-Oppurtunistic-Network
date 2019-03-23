
var savedPolygons = [];
var savedPoi = [];
var positions = [];
var mainPolygon = null ;
var Po = null;
var map; 




function start() {

    var MOHAMMEDIA = {lat: 33.69589, lng: -7.387846};
   
    var MEDIA_BOUNDS = {
        north: 33.73,//done
        south: 33.65, //done
        west: -7.453, //done
        east: -7.271,//done
    }
    //Creation du map
        map = new google.maps.Map(document.getElementById('map_canvas'), {
        zoom : 15,
        center: MOHAMMEDIA,
        restriction: {
            latLngBounds: MEDIA_BOUNDS ,
            strictBounds: false,
        },
        
        });


    var input = document.getElementById('pac-input');
    var searchBtn = document.getElementById('search');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    searchBox.addListener('places_changed', function() {

        if (input.value == "") {
            alert("Vous devez saisissez l'endroit que vous chercher");
            return;
        }
        var places = searchBox.getPlaces();

        var location = {lat : places[0].geometry.location.lat(),lng :places[0].geometry.location.lng()}
        savedPolygons.forEach(p=>{
            p.setMap(null);
        });
        savedPoi.forEach(poi=>{
            poi.setMap(null);
        });
        map.setCenter(places[0].geometry.location);
        savedPolygons = [];
        setPolygonsOnMap(places[0].geometry.location);

    });


    var getNPoi = document.getElementById('getNearest');
    getNPoi.addEventListener('click', function() {
        if(savedPolygons.length == 0)   {alert("Merci de mettre l'endroit que vous cherchez");  return;}
        var places = searchBox.getPlaces();
        getNearPoi(places[0].geometry.location);
    });


}


    function setPolygonsOnMap(location){

        d3.json('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+location.lat()+','+location.lng()+'&radius=1000&key=AIzaSyCt6upiIEBBjyXDJAcofd5Yrs0F1ufFzWM', function (pointjson) {

            var pointdata =  pointjson.results;

            pointdata.forEach(function (d) {

                var c = [d.geometry.location.lng,d.geometry.location.lat];
                var marker = new google.maps.Marker({
                    position: {lat: c[1], lng: c[0]},
                    map: map,
                    title: '?!',
                    icon : 'http://maps.google.com/mapfiles/ms/icons/ltblue-dot.png'
                });
                //Window Info
                var infowindow = new google.maps.InfoWindow();
                google.maps.event.addListener(marker, 'click', function() {
                    infowindow.setContent('<div><strong>' + d.name + '</strong><br>' +
                        'Vicinity: ' + d.vicinity + '<br>');
                    infowindow.open(map, this);
                });
                marker.setMap(map);
                savedPoi.push(marker);
                positions.push(c);

            });
            addCorrectPointsVoronoi(positions,location);

            polygons = d3.geom.voronoi(positions);
            var traces = [];
            polygons.forEach(p =>{
                traces = [];
                p.forEach(pg =>{
                    var tmpLatLng = new google.maps.LatLng(pg[1],pg[0]);
                    traces.push({lat: tmpLatLng.lat(),lng: tmpLatLng.lng()});
                });
                var poly = new google.maps.Polygon({
                    paths: traces,
                    strokeColor: '#00e6b8',
                    strokeOpacity: 0.5,
                    strokeWeight: 2,
                    fillColor: '#'+(Math.random()*0xFFFFFF<<0).toString(16),
                    fillOpacity: 0.006
                });
                poly.setMap(map);
                savedPolygons.push(poly);

            });
        });

    }

function getNearPoi(me) {

    var marker = new google.maps.Marker({
        position: me,
        map: map,
        title: 'Position marqué',
        animation: google.maps.Animation.DROP,
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-pushpin.png'
    });
    savedPoi.push(marker);
    marker.setMap(map);

     for(var poly of savedPolygons){

         if (google.maps.geometry.poly.containsLocation(me, poly) && isInside(poly)){
             poly.setOptions({strokeWeight: 0.4, fillColor: '#1aff1a', fillOpacity: 0.42});
             mainPolygon = poly;
             break;
         }

     }


     morePropositions();
}


function morePropositions(){

   var polygonEdges = [];


    for(var edge of mainPolygon.getPath().j)
        polygonEdges.push(edge);

    for(var polygon of savedPolygons) {
        for (var edge of polygon.getPath().j)
            for (var mainEdge of polygonEdges)
                if (edge.lat() == mainEdge.lat() && edge.lng() == mainEdge.lng() && polygon != mainPolygon) {
                    polygon.setOptions({strokeWeight: 1, fillColor: '#80e5ff', fillOpacity: 0.42});
                    console.log("Match");
                    break;
                }

    }
}

function correctPointsVoronoi(center) {

    var  width = 7000;
    var  height = 7000;
    var NORTH = 0;
    var WEST  = -90;
    var SOUTH = 180;
    var EAST  = 90;

    var north = google.maps.geometry.spherical.computeOffset(center, height / 2, NORTH);
    var south = google.maps.geometry.spherical.computeOffset(center, height / 2, SOUTH);

    var northEast = google.maps.geometry.spherical.computeOffset(north, width / 2, EAST);
    var northWest = google.maps.geometry.spherical.computeOffset(north, width / 2, WEST);

    var southEast = google.maps.geometry.spherical.computeOffset(south, width / 2, EAST);
    var southWest = google.maps.geometry.spherical.computeOffset(south, width / 2, WEST);

    var corners = [ northEast, northWest, southWest, southEast ];

    return corners;

}

function  addCorrectPointsVoronoi(positions,center) {

    if(Po) Po.setMap(null);
    var extra_points =  correctPointsVoronoi(center);

    extra_points.forEach(ep =>{
        var tmp = [ep.lng(),ep.lat()];

       positions.push(tmp);
    });
     Po = new google.maps.Polygon({
        paths: extra_points,
        strokeColor: '#ff3333',
        strokeOpacity: 0.5,
        strokeWeight: 2,
        fillColor: '#'+(Math.random()*0xFFFFFF<<0).toString(16),
        fillOpacity: 0.006
    });
    Po.setMap(map);

}






function polygonCenter(poly) {
    var lowx,
        highx,
        lowy,
        highy,
        lats = [],
        lngs = [],
        vertices = poly.getPath();

    for(var i=0; i<vertices.length; i++) {
        lngs.push(vertices.getAt(i).lng());
        lats.push(vertices.getAt(i).lat());
    }

    lats.sort();
    lngs.sort();
    lowx = lats[0];
    highx = lats[vertices.length - 1];
    lowy = lngs[0];
    highy = lngs[vertices.length - 1];
    center_x = lowx + ((highx-lowx) / 2);
    center_y = lowy + ((highy - lowy) / 2);
    return (new google.maps.LatLng(center_x, center_y));
}


function isInside(polygon){

    for(var edge of polygon.getPath().j)
        if(!(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(edge.lat(),edge.lng()),Po)))
            return false;
    return true;
}