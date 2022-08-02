const express = require("express");
require('dotenv').config()
const app = express();

const port = 3000;

var SpotifyWebApi = require("spotify-web-api-node");

var spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// Retrieve an access token.
const accessToken = spotifyApi.getAccessToken();
if (!accessToken) {
  spotifyApi.clientCredentialsGrant().then(
    function (data) {
      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body["access_token"]);
    },
    function (err) {
      console.log("Something went wrong when retrieving an access token", err);
    }
  );
}

// Get Artist results from a search query
app.get("/search/:query", (req, res) => {
  const query = req.params.query;
  // Search artists whose name contains query params
  spotifyApi.searchArtists(query).then(
    function (data) {
      console.log('Search artists by "Love"', data.body);
      res.send(data.body);
    },
    function (err) {
      console.error(err);
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
    }
  );
});

app.listen(port, (error) => {
  if (error) {
    console.log("Couldn't start server", error);
  } else {
    console.log(`Server running at ${port}`);
  }
});
