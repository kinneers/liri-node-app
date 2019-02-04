// Read and set environment variables
require('dotenv').config();
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios = require('axios');
var moment = require('moment');
var fs = require('fs');
var inquirer = require('inquirer');
var command;
var args;

//Determines which command was used (choices are 'concert-this', 'spotify-this-song', 'movie-this', and 'do-what-it-says')
function runProgram() {
    inquirer.prompt([
        {
            type: "list",
            message: "Welcome!  What would you like to do today?",
            choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
            name: "command"
        }
    ]).then(function(res) {
        command = res.command;
        addToLog(command);
        if (command === 'do-what-it-says') {
            getResult(command);
            addToLog(args);
        } else {
            inquirer.prompt([
                {
                type: "input",
                message: "What would you like to search for?",
                name: "username"
                }
            ]).then(function(search) {
                args = search.username.replace(' ', '+');
                getResult(command, args);
                addToLog(args);
            });
        }
    });
};
runProgram();

function getResult(command, args) {
    switch (command) {
        case 'concert-this':
            concert(args);
            break;
        case 'spotify-this-song':
            spotifySong(args);
            break;
        case 'movie-this':
            movieInfo(args);
            break;
        case 'do-what-it-says':
            fileCommand(args);
            break;
        default:
            console.log("This command was not recognized.");
    }
}

//Prompts the use to either choose to search again or exit
function finalPrompt() {
    inquirer.prompt([
        {
        type: "list",
        message: "Would you like to search again or exit?",
        choices: ["Search", "Exit"],
        name: "again"
        }
    ]).then(function(res) {
        var answer = res.again;
        if (answer === 'Search') {
            runProgram();
        }
        else {
            console.log("That was fun!  Let's do it again soon.");
        }
    });
}

function concert(args) {
    args = "New Kids on the Block";
    //Checks whether or not a value for args has been previously set (by do-what-it-says), if not sets args
    if (!args) {
        //Gets the band or artist name from args
        args = process.argv.splice(3).join('+');
    }
    //Queries Bands in Town API
    var query = "https://rest.bandsintown.com/artists/" + args + "/events?app_id=codingbootcamp"
    //Prints list of each event's venue, location, and date to the console
    axios.get(query).then(function(res){
        for (var i = 0; i < res.data.length; i++) {
            var venue = res.data[i].venue.name;
            console.log(venue);
            var city = res.data[i].venue.city
            console.log(city);
            var date = res.data[i].datetime
            var newDate = moment(date).format('MM/DD/YYYY');
            console.log(newDate);
            console.log('------------------------------');
            text = args + ', ' + venue + ', ' + city + ', ' + newDate + ', ';
            addToLog(text);
        }
        finalPrompt();
    });
}

function spotifySong(args) {
    //Checks whether or not a value for args has been previously set (by do-what-it-says), if not sets args
    if (!args) {
        //Gets the song name from args; if no song is entered, assigns default song to "The Sign" by Ace of Base
        if (process.argv[3]) {
            args = process.argv.splice(3).join('+');
        }
        else {
            // Narrowed choices to only 2 versions
            args = "track:the+sign%20artist:ace+of+base%20year:2008";
        }
    }
    //Displays artist(s), song name, preview link, album
    spotify.search({ type: 'track', query: args }).then(function(response) {
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
            text = args + ', ' + artists + ', ' + songName + ', ' + preview + ', ' + albumName + ', ';
            addToLog(text);
        }
        finalPrompt();
    }).catch(function(err){
        console.log(err);
    });
}

function movieInfo(args) {
    //Checks whether or not a value for args has been previously set (by do-what-it-says), if not sets args
    if (!args) {
        //Gets the movie name from args; if no movie is entered, assigns default movie to "Mr. Nobody"
        if (process.argv[3]) {
            args = process.argv.splice(3).join('+');
        }
        else {
            args = "mr+nobody";
        }
    }
    //Call to the OMDB API
    axios.get("http://www.omdbapi.com/?t=" + args + "&y=&plot=short&apikey=trilogy").then(function(response) {
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
        text = args + ', ' + title + ', ' + year + ', ' + imdbRating + ', ' + rottenTomatoes + ', ' + country + ', ' + language + ', ' + plot + ', ' + actors + ', ';
        addToLog(text);
        finalPrompt();
    });
}

function fileCommand(args) {
    fs.readFile("random.txt", "utf8", function(error, data) {
        // If the code experiences any errors it will log the error to the console.
        if (error) {
          return console.log(error);
        }
        // Split the data by commas
        var dataArr = data.split(",");
        // Re-display the content as an array
        console.log(dataArr);
        command = dataArr[0];
        tempArgs = dataArr[1];
        tempArgs = tempArgs.split(' ').join('+');
        args = tempArgs.replace(/"/g,"");
        console.log(tempArgs);
        console.log(args);

        switch (command) {
            case 'concert-this':
                concert(args);
                break;
            case 'spotify-this-song':
                spotifySong(args);
                break;
            case 'movie-this':
                movieInfo(args);
                break;
            default:
                console.log("This command was not recognized.");
        }
      });
}

var divider = "\n------------------------------------------------------------\n\n";
//Function to append content to log.txt
function addToLog(text) {
    fs.appendFile("log.txt", text + divider, function(err) {
        // If an error was experienced we will log it.
        if (err) {
          console.log(err);
        }
      });
}
