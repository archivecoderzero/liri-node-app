//-------------COMMANDS--------------------------------//
//concert-this
//spotify-this-song
//movie-this
//do-what-it-says

require("dotenv").config();
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var moment = require('moment');
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var fs = require('fs');


//-------------COMMANDS--------------------------------//
//concert-this
//spotify-this-song
//movie-this
//do-what-it-says



// How the user can search the song with space and another parameters. 
var liriResponse = process.argv[2];
var search = process.argv.slice(3).join(" ");

switch (liriResponse) {
  case "spotify-this-song":
    spotifySong();
    break;

  case "movie-this":
    movieInfo();
    break;

  case "concert-this":
    bandsInTown();
    break;

  case "do-what-it-says":
    doWhatItSays();
    break;
};


function spotifySong() {

  if (!search) {
    search = "first date blink 182";

    console.log("---> You have not entered any songs, by default its going to be first date blink 182");

    console.log("\n-------------\n");
  } else if (search) {

    console.log("These are the top 3 results")
    console.log("\n-------------\n");
  };

  spotify.search({ type: 'track', query: search, limit: 3 }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }

    var trackInfo = data.tracks.items;

    for (var i = 0; i < trackInfo.length; i++) {

      var artists = trackInfo[i].artists[0].name;
      var album = trackInfo[i].album.name;
      var songName = trackInfo[i].name;
      var previewLink = trackInfo[i].preview_url;

      console.log("Artist Name:  " + artists);
      console.log("Song Name: " + songName);
      console.log("Album Name:  " + album);
      console.log("Preview Link: " + previewLink);
      console.log("\n-------------\n");
    }

  });


};

function movieInfo() {

  if (!search) {
    search = "Mr Nobody";

    console.log("\n -- Mr. Nobody is the default, enter a movie title\n");
  } else if (search) {
    // Print in terminal a message for the user
    console.log("\n -- This is the result of your query \n");
  };

  axios.get("http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=trilogy").then(
    function (response) {
      console.log("Title of the movie:  " + response.data.Title);
      console.log("year came out: " + response.data.Year);
      console.log("IMDB Rating:  " + response.data.Ratings[0].Value);
      console.log("Rotten Tomatoes:  " + response.data.Ratings[1].Value);
      console.log("Country:  " + response.data.Country);
      console.log("Language:  " + response.data.Language);
      console.log("Plot:  " + response.data.Plot);
      console.log("Actors: " + response.data.Actors);
    }).catch(function (error) {
      console.log(error + " =====> the Query for movie-this did not return any result");

    }).finally(function () {
    });
};

function bandsInTown() {

  if (!search) {
    search = "Madona";

    console.log("\n -- You have not entered anything, by default it will be Madona");
  } else if (search) {

  };

  axios.get("https://rest.bandsintown.com/artists/" + search + "/events?app_id=943e8f5b-037a-453f-84bd-a9aa28593784").then(
    function (response) {
      var concertInfo = response.data;

      if (concertInfo.length <= 0) {
        console.log("no result on your query , try again.");
      } else {
        console.log("-----> this are the venues available\n");
      };

      for (var i = 0; i < concertInfo.length; i++) {

        var artist = concertInfo[i].artist_id;
        var artistName = concertInfo[i].lineup[0];
        var venueName = concertInfo[i].venue.name;
        var country = concertInfo[i].venue.country;
        var city = concertInfo[i].venue.city;
        var date = concertInfo[i].datetime;
        var dateMoment = moment(date).format('MMMM Do YYYY, h:mm:ss a');
        var tickets = concertInfo[i].offers[0].url;
        console.log("Artist ID:  " + artist);
        console.log("Artist Name:  " + artistName);
        console.log("Venue Name:  " + venueName);
        console.log("Country: " + country);
        console.log("City:  " + city);
        console.log("Date: " + dateMoment);
        console.log("Tickets available: " + tickets);
        console.log("\n-------------");
      }
    }).catch(function (error) {
      console.log(error + " --> an error has occured , please try again");

    }).finally(function () {
    });

};

function doWhatItSays() {
  fs.readFile('random.txt', 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }

    data = data.split(',');
    console.log(data);

    liriResponse = data[0];

    if (liriResponse === "spotify-this-song") {
      search = (data[1]);
      spotifySong();
    } else if (liriResponse === "concert-this") {
      search = (data[1]);
      bandsInTown();
    } else if (liriResponse === "movie-this") {
      search = (data[1]);
      movieInfo();
    }
  })
}


fs.appendFile("log.txt", liriResponse + " " + search + "\n", function(err) {

  if (err) {
    console.log(err);
  }


  else {
  
    console.log("\n-------------\n Liri App Running")
  }

});
