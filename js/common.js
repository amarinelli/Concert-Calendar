var modifySearchInput = true;
var map;
var geocoder;
var markers = [];
var infowindow;
var toronto;
var table;

$(document).ready(function() {
	console.log('ready');

	toastr.options.progressBar = true;
	toastr.options.closeButton = true;

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
		url:"https://www.kimonolabs.com/api/69auren6?&apikey=8mJuGzeHSesPIM93SJ19pXgAuLx9sxEE&kimmodify=1",
		crossDomain:true,
		dataType:"jsonp",
		success: function(response, status, xhr) {
			var results = response.results;
			var data = results.data;
			// collection.forEach(CreateTable);

			table = $('#myTable').DataTable({
				"data": data,
				"order": [ 2, 'asc' ], //order by date column
				"orderClasses": true,
				"lengthChange": true,
				"lengthMenu": [ 10, 25, 50, 75, 100 ],
				"columns": [
					{type: "string", data: "artist"},
					{type: "string", data: "venue"},
					{type: "date", className: "nowrap", data: "date"},
					{type: "num-fmt", data: "price"}
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

			$('i').each(function(){
				$(this).attr("onclick", "GoogleMapVenue_click(this.innerHTML)");
			});

			$('i').each(function(){
				$(this).attr("style", "cursor: pointer;");
			});

		},
		error: function (xhr, status) {
			console.log(status);
		}
	});

	$("#map-canvas").mouseover(function() {
		$(this).animate({
			height: "250px"}, {
				queue:false,
				duration:600,
				progress: function() {
					table.columns.adjust().draw();
				}
			})
	});

	$("#map-canvas").mouseout(function() {
		$(this).animate({
			height: "175px"}, {
				queue:false,
				duration:600,
				progress: function() {
					table.columns.adjust().draw();
				}
			})
	});

});

//Venue click event - Places search
function GoogleMapVenue_click(venue_name) {
	//focus map by increasing height
	// var mapFrame = document.getElementById("map-canvas");
	// if (mapFrame.style.height != '250px') {
	// 	mapFrame.style.height = '250px';
	// 	//refresh table headers
	// 	table.columns.adjust().draw();
	// }

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
  } else {
		// alert("Cannot find venue...");
		// Display a warning toast, with no title
		toastr.warning('Cannot find venue...')
	}
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

// function CreateTable(element, index, array) {
// 	var table = document.getElementById("tableBody");
// 	//if element.artist.text
// 	if (typeof element.date === 'object') {
// 		var date_raw = element.date.text;
// 		var date = date_raw.substring(0,3) + ". " + date_raw.substring(4);
// 	} else if (element.api == "collective-concerts") {
// 		var date_raw = element.date;
// 		lookup = {"1":"Jan","2":"Feb","3":"Mar","4":"Apr","5":"May","6":"Jun","7":"Jul","8":"Aug","9":"Sept","10":"Oct","11":"Nov","12":"Dec"};
// 		var weekday = date_raw.substring(0,3);
// 		var split_date = date_raw.split(" ");
// 		var month = lookup[split_date[1].split("/")[0]];;
// 		var day = split_date[1].split("/")[1];
// 		var date = weekday + ". " + month + " " + day;
// 	} else {
// 		var date = element.date;
// 	}
//
// 	var tr = document.createElement("TR");
// 	var newcell1 = tr.insertCell(-1);
// 	var newcell2 = tr.insertCell(-1);
// 	var newcell3 = tr.insertCell(-1);
// 	var newcell4 = tr.insertCell(-1);
//
// 	newcell1.innerHTML=element.artist;
// 	newcell2.innerHTML=element.venue;
// 	newcell3.innerHTML=date;
// 	newcell4.innerHTML=element.price;
//
// 	newcell2.setAttribute("onclick", "GoogleMapVenue_click(this.innerHTML)");
// 	newcell2.setAttribute("style", "cursor: pointer;");
//
// 	if (tr != null){
// 		table.appendChild(tr);
// 	}
// };
