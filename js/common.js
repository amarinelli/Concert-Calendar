$(document).ready(function() {
	console.log('ready');
	$.ajax({
		"url":"https://www.kimonolabs.com/api/69auren6?apikey=dHMljbNpnmzYGGsQ7XfqOeIoxw9zGGQI&callback=kimonoCallback",
		"crossDomain":true,
		"dataType":"jsonp",
		"complete": function(){
			$('#myTable').DataTable( {
				"order": [ 2, 'asc' ],
				"lengthMenu": [ 10, 25, 50, 75, 100 ],
				"columns": [ 
					{"type": "string"},
					{"type": "string"},
					{"type": "date"},
					{"type": "num-fmt"}
				],
				"paging": true,
				"autoWidth": true,
				"scrollCollapse": true,
				"responsive": true,
				"stateSave": true,
				"stateSaveParams": function (settings, data) {
					data.search.search = "";
				}
			});     
		}
	});		
});

function kimonoCallback(data) {	
	var table = document.getElementById("tableBody");
	var results = data.results;
	var collection1 = results.collection1;
	for (index=1;index<301;index++) {
		var event = collection1[index];
		var tr = document.createElement("TR");
		var newcell1 = tr.insertCell(-1);
		var newcell2 = tr.insertCell(-1);
		var newcell3 = tr.insertCell(-1);
		var newcell4 = tr.insertCell(-1);
		newcell1.innerHTML=event.artist;		
		newcell2.innerHTML=event.venue;		
		newcell3.innerHTML=event.date;		
		newcell4.innerHTML=event.price;		
		table.appendChild(tr);
	}				
}