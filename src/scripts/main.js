var map;
var infowindow;
var markers = [];
var address;
var toronto;
var table;

$(document).ready(function() {

	var images = ['background.jpg', 'background2.jpg', 'background3.jpg', 'background4.jpg', 'background5.jpg'];
	$('body').css({'background-image': 'url(images/' + images[Math.floor(Math.random() * images.length)] + ')'});

	toastr.options = {
		progressBar: false,
	  closeButton: true,
		positionClass: "toast-bottom-center",
		onclick: VenueSearch
	};

	toronto = new google.maps.LatLng(43.6500, -79.3400);

	var mapOptions = {
		center: toronto,
		zoomControl: true,
		streetViewControl: true,
		zoom: 11
	};

	infowindow = new google.maps.InfoWindow();

	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	var centerControlDiv = document.createElement('div');
	var centerControl = new CenterControl(centerControlDiv, map);

	centerControlDiv.index = 1;
	map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(centerControlDiv);

	function CenterControl(controlDiv, map) {

		// Set CSS for the control border
		var controlUI = document.createElement('div');
		controlUI.style.backgroundColor = '#fff';
		controlUI.style.border = '2px solid #fff';
		controlUI.style.borderRadius = '3px';
		controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
		controlUI.style.cursor = 'pointer';
		controlUI.style.marginBottom = '25px';
		controlUI.style.marginLeft = '0px';
		controlUI.style.textAlign = 'center';
		controlUI.title = 'Expand';
		controlDiv.appendChild(controlUI);

		// Set CSS for the control interior
		var controlText = document.createElement('div');
		controlText.style.color = 'rgb(25,25,25)';
		controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
		controlText.style.fontSize = '10px';
		controlText.style.lineHeight = '25px';
		controlText.style.paddingLeft = '5px';
		controlText.style.paddingRight = '5px';
		controlText.innerHTML = 'Expand';
		controlUI.appendChild(controlText);

		google.maps.event.addDomListener(controlUI, 'click', function() {

			currentCenter = map.getCenter();

			if ($('#map-canvas').height() == 200) {
				$("#map-canvas").animate({
					height: "300px"}, {
						queue: false,
						duration: 500
				});
				window.setTimeout(function() {
					map.panTo(currentCenter);
				}, 500);

			} else {
				$("#map-canvas").animate({
					height: "200px"}, {
						queue: false,
						duration: 500
				});
			}
		});
	}

	$(window).resize(function(){
		google.maps.event.trigger(map, 'resize');
	});

	var ajaxReq = $.ajax({
		beforeSend: function() {
			$('#loading').show();
		},
		url:"https://www.kimonolabs.com/api/69auren6?&apikey=8mJuGzeHSesPIM93SJ19pXgAuLx9sxEE&kimmodify=1",
		dataType:"jsonp",
		timeout: 5000,
		success: CreateTable,
		error: function (xhr, status) {
			console.log(status);
			ajaxReq.abort();
			toastr.warning("Using local cached copy", "Unable to load data");
			$.ajax({
				url: "data/kimonoData.min.json",
				dataType: "json",
				success: CreateTable
			});
		}
	});
}); // end of ready

function CreateTable(response) {
	var results = response.results;
	var data = results.data;

	$('#myTable').show();

	table = $('#myTable').DataTable({
		"data": data,
		"order": [ 2, 'asc' ], //order by date column
		"orderClasses": true,
		"lengthChange": true,
		"lengthMenu": [ 10, 25, 50, 75, 100 ],
		"columns": [
			{type: "string", data: "artist"},
			{type: "string", data: "venue"},
			{type: "date", data: "date"},
			{type: "num-fmt", data: "price"}
		],
		"language": {
			"searchPlaceholder": "",
			"sSearch": "",
			"infoEmpty": "Nothing to see...",
			"infoFiltered": "",
			"info": "Showing page _PAGE_ of _PAGES_",
			"infoPostFix": " (_MAX_ total records)",
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

	var filterDivLbl = document.getElementById("myTable_filter").firstChild;
	var searchInput = filterDivLbl.firstChild;
	searchInput.setAttribute("id","search_table");
	searchInput.setAttribute("type","text");
	searchInput.setAttribute("tabindex","0");
	searchInput.setAttribute("title","Live filter, Esc to clear");
	searchInput.setAttribute("autofocus","");
	searchInput.setAttribute("placeholder","Filter shows by any column");

	$('#loading').hide();
	CreateTimeStamp(response);
}

function CreateTimeStamp(response) {
	var day = response.results.site[0].updateDate;
	var time = response.results.site[0].updateTime;
	var sourceSite = response.results.site[0].source.alt;
	var sourceUrl = response.results.site[0].source.href;

	var replacements = {
		"%DAY%": day,
		"%TIME%": time,
		"%SITE%": sourceSite,
		"%URL%": sourceUrl
	};

	str = "<code>Last Updated: %DAY% @ %TIME% by</code><a class='update-link' href='%URL%'> %SITE%</a>";

	updateString = str.replace(/%\w+%/g, function(all) {
		return replacements[all] || all;
	});

	$("#update-header").html(updateString);
	$("#update-footer").html(updateString);
}

//Venue click event - Places search
function GoogleMapVenue_click(venue_name) {

	toastr.clear();

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
		//place marker for first result only (assumed best match)
    createMarker(results[0]);

		if (!$('#map-canvas').visible()) {
			$.smoothScroll('map-canvas');
		}

  } else {
		toastr.warning("<div class='toast-extra'>Click here to search it</div>", address + " not found");
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
    infowindow.setContent("<div class='info-window'>" + "<b>" + place.name + "</b>" + "<br>" + place.vicinity + "</div>");
    infowindow.open(map, this);
  });

	google.maps.event.addListener(map, 'resize', function() {
		window.setTimeout(function() {
			map.panTo(marker.getPosition());
		}, 400);
	});
}

function VenueSearch() {
	var searchUrl = ("http://google.ca/search?q=toronto+" + encodeURIComponent(address.replace(/&amp;/g, '&')));
	window.open(searchUrl);
}

$(function(){
		$('html').keydown(function(e){
			if (e.which == 37) {
				$("#myTable_previous").click();
			} else if (e.which == 39) {
				$("#myTable_next").click();
			} else if (e.which == 27) {
				$("#search_table").val("");
			}
		});
});
