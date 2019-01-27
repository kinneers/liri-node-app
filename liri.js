require('dotenv').config();

var keys = require('./keys.js');

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