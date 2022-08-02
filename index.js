const path = require("path");
const express = require("express");
var favicon = require("serve-favicon");
require("dotenv").config();
const app = express();

const PORT = process.env.PORT || 8080;

var SpotifyWebApi = require("spotify-web-api-node");

var spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

function checkAccess() {
  // Retrieve an access token.
  const accessToken = spotifyApi.getAccessToken();
  if (!accessToken) {
    spotifyApi.clientCredentialsGrant().then(
      function (data) {
        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body["access_token"]);
      },
      function (err) {
        console.log(
          "Something went wrong when retrieving an access token",
          err
        );
      }
    );
  }
}

app.set("port", PORT);

app.get("/", (req, res) => {
  res.send("Hello Heroku");
});

// Get Artist results from a search query
app.get("/search/:query", (req, res) => {
  checkAccess();

  const query = req.params.query;
  // Search artists whose name contains query params
  spotifyApi.searchArtists(query).then(
    function (data) {
      console.log('Search artists by "Love"', data.body);
      res.send(data.body);
    },
    function (err) {
      console.error(err);
      res.send(err.message);
    }
  );
});

// Get albums from artist id
app.get("/artistAlbums/:id", (req, res) => {
  const id = req.params.id;
  // get artist's albums
  spotifyApi.getArtistAlbums(id).then(
    function (data) {
      console.log("Artist albums", data.body);
      res.send(data.body);
    },
    function (err) {
      console.error(err);
      res.send(err.message);
    }
  );
});

// Get tracks from album
app.get("/albumTracks/:id", (req, res) => {
  const id = req.params.id;
  // Get tracks in an album
  spotifyApi.getAlbumTracks(id, { limit: 25, offset: 0 }).then(
    function (data) {
      console.log(data.body);
      res.send(data.body);
    },
    function (err) {
      console.log("Something went wrong!", err);
      res.send(err.message);
    }
  );
});

app.listen(PORT, function () {
  console.log(
    "Express server listening on port %d in %s mode",
    PORT,
    app.settings.env
  );
});

app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

checkAccess();
