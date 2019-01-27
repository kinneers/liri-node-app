// Read and set environment variables
require('dotenv').config();

var keys = require('./keys.js');

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var axios = require('axios');
var moment = require('moment');

var command = process.argv[2];
console.log(command);

if (command === 'concert-this') {
    var artist = process.argv.splice(3).join('+');
    var query = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
    console.log("Got in");
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

if (command === 'spotify-this-song') {
    console.log('Working so far')
    var song;

    //Assigns song the value of arguments after 2; if no song is entered, assigns default song to "The Sign"
    if (process.argv[3]) {
        song = process.argv.splice(3).join('+');
    }
    else {
        song = "the+sign%20ace+of+base%20year:2008";
    }
    console.log(song);
    spotify.search({ type: 'track', query: song }).then(function(response) {
        var artists = response.tracks.items[0].artists[0].name;
        console.log(artists);
    }).catch(function(err){
        console.log(err);
    });
}