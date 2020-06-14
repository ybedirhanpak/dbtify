import db from "../../database";
import albumService from "./albumService";
import songService from "./songService";

const createArtist = async (name, surname) => {
  console.log("** CREATE ARTIST **");
  const queryText = "INSERT INTO artist(name,surname)" + " VALUES($1,$2);";
  const result = await db.queryP(queryText, [name, surname]);

  return {
    message: result.response ? "Artist created." : "Artist cannot be created",
    error: result.error ? result.error.stack : undefined,
  };
};

const login = async (name, surname) => {
  console.log("** GET ARTIST **");
  const queryText =
    "SELECT * FROM artist" + " WHERE name = $1 AND surname = $2;";
  const result = await db.queryP(queryText, [name, surname]);
  const { response, error } = result;
  if (error) {
    return {
      message: "Artist cannot be returned",
      error: error.stack,
    };
  }
  let message = response.rows[0] ? "Artist returned." : "Artist not found";
  return {
    artist: response.rows[0],
    message,
  };
};

const getAllArtists = async () => {
  console.log("** GET ALL ARTISTS **");
  const queryText =
    "SELECT a.id, a.name, a.surname, SUM(s.likes) as likes" +
    " FROM artist AS a" +
    ' INNER JOIN "artist-song-produce" AS asp on a.id = asp.artistid' +
    " INNER JOIN song AS s on asp.songid = s.id" +
    " GROUP BY a.id" +
    " ORDER BY likes DESC;";

  const result = await db.queryP(queryText);
  const { response, error } = result;
  if (error) {
    return {
      message: "Artists cannot be returned",
      error: error.stack,
    };
  }
  let message = response.rows ? "Artists returned." : "Artists not found";
  return {
    artists: response.rows,
    message,
  };
};

const getArtist = async (id) => {
  console.log("** GET ARTIST **");
  const queryText = "SELECT * FROM artist" + " WHERE id = $1";
  const result = await db.queryP(queryText, [id]);
  const { response, error } = result;
  if (error) {
    return {
      message: "Artist cannot be returned",
      error: error.stack,
    };
  }
  const artist = response.rows[0];
  const message = artist ? "Artist returned." : "Artist not found";

  const albumResult = await albumService.getAlbumsOfArtist(id);
  if (!albumResult.error && artist) {
    artist.albums = albumResult.albums;
  } else {
    console.log(albumResult.error);
  }

  const songResult = await songService.getSongsOfArtist(id);
  if (!songResult.error && artist) {
    artist.songs = songResult.songs;
  } else {
    console.log(songResult.error);
  }

  return {
    artist,
    message,
  };
};

const getArtistsOfSong = async (id) => {
  console.log("** GET ARTISTS OF SONG **");
  const queryText =
    "SELECT artistid" + ' FROM "artist-song-produce"' + "WHERE songid = $1;";
  const result = await db.queryP(queryText, [id]);
  const { response, error } = result;
  if (error) {
    return {
      message: "Artists cannot be returned",
      error: error.stack,
    };
  }
  let message = response.rows ? "Artists returned." : "Artists not found";
  return {
    artists: response.rows,
    message,
  };
};

export default {
  createArtist,
  login,
  getAllArtists,
  getArtist,
  getArtistsOfSong,
};
