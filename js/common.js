var modifySearchInput = true;

$(document).ready(function() {
	console.log('ready');

	var mapOptions = {
					center: { lat: 43.7000, lng: -79.4000},
					zoom: 10
	};
	var map = new google.maps.Map(document.getElementById('map-canvas'),
		mapOptions);

	$.ajax({
		"url":"https://www.kimonolabs.com/api/6q5hyhqo?apikey=dHMljbNpnmzYGGsQ7XfqOeIoxw9zGGQI&callback=kimonoCallback",
		"crossDomain":true,
		"dataType":"jsonp",
		"complete": function(){
			var table = $('#myTable').DataTable( {
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

function CreateTable(element, index, array) {
	var table = document.getElementById("tableBody");
	//if element.artist.text
	if (typeof element.date === 'object') {
		var date_raw = element.date.text;
		var date = date_raw.substring(0,3) + ". " + date_raw.substring(4);
	} else if (element.api == "collective-concerts") {
		var date_raw = element.date;
		lookup = {"1":"Jan", "2":"Feb", "3":"Mar","4":"Apr","5":"May","6":"Jun","7":"Jul","8":"Aug","9":"Sept","10":"Oct","11":"Nov","12":"Dec"};
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
		newcell2.setAttribute("onclick", "GoogleMapVenue(this.innerHTML)");
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

function GoogleMapVenue(clicked_id)
{
    console.log(clicked_id);
}
