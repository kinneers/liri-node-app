// Read and set environment variables
require('dotenv').config();
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios = require('axios');
var moment = require('moment');

//Determines which command was used (choices are 'concert-this', 'spotify-this-song', 'movie-this', and 'do-what-it-says')
var command = process.argv[2];

if (command === 'concert-this') {
    //Gets the band or artist name from args
    var artist = process.argv.splice(3).join('+');
    //Queries Bands in Town API
    var query = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
    //Prints list of each event's venue, location, and date to the console
    axios.get(query).then(function(res){
        for (var i = 0; i < res.data.length; i++) {
            console.log(res.data[i].venue.name);
            console.log(res.data[i].venue.city);
            var date = res.data[i].datetime
            var newDate = moment(date).format('MM/DD/YYYY');
            console.log(newDate);
            console.log('------------------------------');
        }
    })
}

else if (command === 'spotify-this-song') {
    var song;
    //Gets the song name from args; if no song is entered, assigns default song to "The Sign" by Ace of Base
    if (process.argv[3]) {
        song = process.argv.splice(3).join('+');
    }
    else {
        // Narrowed choices to only 2 versions
        song = "track:the+sign%20artist:ace+of+base%20year:2008";
    }
    console.log(song);
    //Displays artist(s), song name, preview link, album
    spotify.search({ type: 'track', query: song }).then(function(response) {
        //I chose to loop through the tracks as so many songs have the same/similar titles
        for (var i = 0; i < response.tracks.items.length; i++) {
            var artists = [];
            for (var j = 0; j < response.tracks.items[i].artists.length; j++){
                //Determines if artists array is empty, if so- pushes artist, if not- adds space then pushes artist (for aesthetics)
                if (artists.length < 1) {
                    artists.push(response.tracks.items[i].artists[j].name);
                } else {
                artists.push(' ' + response.tracks.items[i].artists[j].name);
                }
            }
            console.log("-----------------------------")
            console.log("Artist(s): " + artists);
            var songName = response.tracks.items[i].name;
            console.log("Song Name: " + songName);
            var preview = response.tracks.items[i].preview_url;
            if (preview === null){
                console.log("Get a Preview: Sorry, there is no preview available for this track :(");
            }
            else {
                console.log("Get a Preview: " + preview);
            }
            var albumName = response.tracks.items[i].album.name;
            console.log("Album: " + albumName);
            console.log("-----------------------------");
        }
    }).catch(function(err){
        console.log(err);
    });
}

else if (command === 'movie-this') {
    var movieName;
    //Gets the movie name from args; if no movie is entered, assigns default movie to "Mr. Nobody"
    if (process.argv[3]) {
        movieName = process.argv.splice(3).join('+');
    }
    else {
        movieName = "mr+nobody";
    }
    //Call to the OMDB API
    axios.get("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy").then(function(response) {
    //Display Results
    console.log("------------------------------");
    var title = response.data.Title;
    console.log("Title: " + title);
    var year = response.data.Year;
    console.log("Release Year: " + year);
    var imdbRating = response.data.Ratings[0].Value;
    console.log("IMDB Rating: " + imdbRating);
    var rottenTomatoes = response.data.Ratings[1].Value;
    console.log("Rotten Tomatoes Rating: " + rottenTomatoes);
    var country = response.data.Country;
    console.log("The Produced In: " + country);
    var language = response.data.Language;
    console.log("Language: " + language);
    var plot = response.data.Plot;
    console.log("Plot: " + plot);
    var actors = response.data.Actors;
    console.log("Actors: " + actors);
    console.log("------------------------------");
  }
);

}

else if (command === 'do-what-it-says') {
    console.log("You are almost done, Sarah!  Don't forget your idea to refactor to switch statements");
}

else {
    console.log("This command was not recognized.");
}