var modifySearchInput = true;
var map;
var geocoder;
var markers = [];
var infowindow;
var toronto;
var table;

$(document).ready(function() {
	console.log('ready');

	toronto = new google.maps.LatLng(43.7000, -79.4000);

	var mapOptions = {
					center: toronto,
					zoomControl: false,
					caleControl: false,
					zoom: 10
	};
	infowindow = new google.maps.InfoWindow();
	map = new google.maps.Map(document.getElementById('map-canvas'),
		mapOptions);

	$.ajax({
		"url":"https://www.kimonolabs.com/api/69auren6?&apikey=dHMljbNpnmzYGGsQ7XfqOeIoxw9zGGQI&kimmodify=1&callback=kimonoCallback",
		"crossDomain":true,
		"dataType":"jsonp",
		"complete": function(){
			table = $('#myTable').DataTable( {
				"order": [ 2, 'asc' ], //order by date column
				"orderClasses": true,
				"lengthChange": true,
				"lengthMenu": [ 10, 25, 50, 75, 100 ],
				"columns": [
					{"type": "string"},
					{"type": "string"},
					{"type": "date", className: "nowrap"},
					{"type": "num-fmt"},
					{"type": "string", className: "nowrap"}
				],
				"language": {
					"searchPlaceholder": "",
					"sSearch": "",
					"infoEmpty": "Nothing to see...",
					"infoFiltered": "",
					"info": "Showing page _PAGE_ of _PAGES_",
					"infoPostFix": " &nbsp; [_MAX_ total records]",
					"sLengthMenu": "_MENU_"
    		},
				"paging": true,
				"pagingType": "simple",
				"autoWidth": true,
				"scrollCollapse": true,
				"responsive": true,
				"stateSave": false,
				"stateSaveParams": function (settings, data) {
					data.search.search = "";
				}
			});
			new FixedHeader(table);

			if (modifySearchInput) {
				var filterDivLbl = document.getElementById("myTable_filter").firstChild;
				var searchInput = filterDivLbl.firstChild;
				searchInput.setAttribute("style", "width:100%;");
				searchInput.setAttribute("tabindex","1");
				searchInput.setAttribute("title","Search records");
				searchInput.setAttribute("autofocus","");
				searchInput.setAttribute("spellcheck","true");
				searchInput.setAttribute("results","");
				searchInput.setAttribute("placeholder","Filter records");
			}
		}
	});
});

//Venue click event - Places search
function GoogleMapVenue_click(venue_name) {
	//focus map by increasing height
	var mapFrame = document.getElementById("map-canvas");
	if (mapFrame.style.height != '250px') {
		mapFrame.style.height = '250px';
		//refresh table headers
		table.columns.adjust().draw();
	}

	if (venue_name.search(/Danforth Music/i) >=0) {
		address = "The Music Hall";
	} else {
		address = venue_name;
	}
	var request = {
    location: toronto,
		name: address,
    radius: 10000,
  };
	var service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, PlacesCallback);
}

function PlacesCallback(results, status) {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
  if (status == google.maps.places.PlacesServiceStatus.OK) {
		//place marker for first result only
    createMarker(results[0]);
  } else {alert("Cannot find venue...")}
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
		animation: google.maps.Animation.DROP,
    position: place.geometry.location
  });
	//zoom and position
	map.setZoom(14);
	map.setCenter(marker.getPosition());

	markers.push(marker);

  google.maps.event.addListener(marker, 'click', function() {
				//open infowindow
    infowindow.setContent('<div style="line-height:1.35;overflow:hidden;white-space:nowrap;">' + place.name + '</div>');
    infowindow.open(map, this);
  });
}

function CreateTable(element, index, array) {
	var table = document.getElementById("tableBody");
	//if element.artist.text
	if (typeof element.date === 'object') {
		var date_raw = element.date.text;
		var date = date_raw.substring(0,3) + ". " + date_raw.substring(4);
	} else if (element.api == "collective-concerts") {
		var date_raw = element.date;
		lookup = {"1":"Jan","2":"Feb","3":"Mar","4":"Apr","5":"May","6":"Jun","7":"Jul","8":"Aug","9":"Sept","10":"Oct","11":"Nov","12":"Dec"};
		var weekday = date_raw.substring(0,3);
		var split_date = date_raw.split(" ");
		var month = lookup[split_date[1].split("/")[0]];;
		var day = split_date[1].split("/")[1];
		var date = weekday + ". " + month + " " + day;
	} else {
		var date = element.date;
}
	if ((/^ARTIST__/).test(element.artist) != true) {
		var tr = document.createElement("TR");
		var newcell1 = tr.insertCell(-1);
		var newcell2 = tr.insertCell(-1);
		var newcell3 = tr.insertCell(-1);
		var newcell4 = tr.insertCell(-1);
		var newcell5 = tr.insertCell(-1);

		if (element.api == "collective-concerts") {
			newcell1.innerHTML=element.artist.text;
			newcell2.innerHTML=element.venue;
			newcell3.innerHTML=date;
			newcell4.innerHTML=element.price;
		} else if (element.api == "just-shows") {
			newcell1.innerHTML=element.artist.text;
			newcell2.innerHTML=element.venue.text;
			newcell3.innerHTML=date;
			newcell4.innerHTML=element.price.text;
		} else {
			newcell1.innerHTML=element.artist;
			newcell2.innerHTML=element.venue;
			newcell3.innerHTML=date;
			newcell4.innerHTML=element.price;
		}
		newcell2.setAttribute("onclick", "GoogleMapVenue_click(this.innerHTML)");
		newcell2.setAttribute("style", "cursor: pointer;");
		newcell5.innerHTML=element.api;
	}
	if (tr != null){
		table.appendChild(tr);
	}
};

function kimonoCallback(data) {
	var results = data.results;
	var collection = results.data;

	collection.forEach(CreateTable);
}
