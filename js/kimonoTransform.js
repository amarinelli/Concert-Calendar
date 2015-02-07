// https://help.kimonolabs.com/hc/en-us/articles/203744354-Modify-your-API-results-with-a-javascript-function-experimental-
// occurs on Kimono servers

function transform(data) {

  // Remove the source html table headers
  data.results.data.splice(0,1);
  data.count -= 1;

  // add click event to venue item
  shows = data.results.data;
  shows.forEach(function(show){
    venue = show.venue;
    show.venue = "<div class='venue-link' onclick='GoogleMapVenue_click(this.innerHTML)'>"
      + venue
      + "</div>";
  });

  return data;
}
