import db from "../../database";
import songService from "./songService";

const createAlbum = async (title, genre, artistID) => {
  console.log("** CREATE ALBUM **");
  const queryText =
    "INSERT INTO album(title,genre,artistID,likes)" + " VALUES($1,$2,$3,$4);";
  const result = await db.queryP(queryText, [title, genre, artistID, 0]);

  return {
    message: result.response ? "Album created." : "Album cannot be created",
    error: result.error ? result.error.stack : undefined,
  };
};

const getAlbum = async (id) => {
  console.log("** GET ALBUM **");
  const queryText =
    "SELECT a.id, a.title, a.genre, a.likes, a.artistid, (artist.name || ' ' || artist.surname) as artist" +
    " FROM album AS a" +
    " INNER JOIN artist ON a.artistid = artist.id" +
    " WHERE a.id = $1";
  const result = await db.queryP(queryText, [id]);
  const { response, error } = result;
  if (error) {
    return {
      message: "Album cannot be returned",
      error: error.stack,
    };
  }
  const album = response.rows[0];
  let message = "Album not found";
  if (album) {
    message = "Album returned.";
    const songsResult = await songService.getSongsOfAlbum(album.id);
    if (songsResult.error) {
      return {
        message: songsResult.message,
        error: songsResult.error,
      };
    }
    album.songs = songsResult.songs;
  }

  return {
    album: album,
    message,
  };
};

const getAllAlbums = async () => {
  console.log("** GET ALL ALBUMS **");
  const queryText =
    "SELECT a.id, a.title, a.genre, a.likes," +
    " a.artistid, (art.name || ' ' || art.surname) as artist " +
    " FROM album AS a" +
    " INNER JOIN artist AS art on a.artistid = art.id;";
  const result = await db.queryP(queryText);
  const { response, error } = result;
  if (error) {
    return {
      message: "Albums cannot be returned",
      error: error.stack,
    };
  }
  let message = response.rows ? "Albums returned." : "Albums not found";
  return {
    albums: response.rows,
    message,
  };
};

const updateAlbum = async (id, genre, title) => {
  console.log("** UPDATE ALBUM **");
  const queryText =
    "UPDATE album" + " SET genre = $2, title = $3 " + " WHERE id = $1";
  const result = await db.queryP(queryText, [id, genre, title]);

  return {
    message: result.response ? "Album updated." : "Album cannot be updated",
    error: result.error ? result.error.stack : undefined,
  };
};

const deleteAlbum = async (id) => {
  console.log("** DELETE ALBUM **");
  const queryText = "DELETE from album" + " WHERE id = $1";
  const result = await db.queryP(queryText, [id]);

  return {
    message: result.response ? "Album deleted." : "Album cannot be deleted.",
    error: result.error ? result.error.stack : undefined,
  };
};

const getAlbumsOfArtist = async (id) => {
  console.log("** GET ALL ALBUMS OF ARTIST **");
  const queryText =
    "SELECT a.id, a.title, a.genre, a.likes, a.artistid, (art.name || ' '  || art.surname) as artist" +
    " FROM album AS a" +
    " INNER JOIN artist AS art ON a.artistid = art.id" +
    " WHERE artistid = $1;";
  const result = await db.queryP(queryText, [id]);
  const { response, error } = result;
  if (error) {
    return {
      message: "Albums cannot be returned",
      error: error.stack,
    };
  }
  let message = response.rows ? "Albums returned." : "Albums not found";
  return {
    albums: response.rows,
    message,
  };
};

const incrementLike = async (albumID, listenerID) => {
  console.log("** INCREMENT LIKE ALBUM**");
  const queryText =
    "UPDATE album" +
    " SET likes = likes + 1 " +
    " WHERE id = $1 AND id NOT IN (" +
    " SELECT albumid" +
    ' FROM "listener-album-like"' +
    " WHERE listenerid = $2" +
    ");";
  const result = await db.queryP(queryText, [albumID, listenerID]);

  return {
    message: result.response ? "Song updated." : "Song cannot be updated",
    error: result.error ? result.error.stack : undefined,
  };
};

const getLikedAlbumsOfListener = async (listenerID) => {
  console.log("** GET ALL ALBUMS OF LISTENER LIKE **");
  const queryText =
    "SELECT a.id, a.title, a.genre, a.likes, a.artistid, (art.name || ' ' || art.surname) AS artist" +
    ' FROM "listener-album-like" AS lal' +
    " INNER JOIN album AS a ON a.id = lal.albumid" +
    " INNER JOIN artist AS art ON art.id = a.artistid" +
    " WHERE listenerid = $1;";
  const result = await db.queryP(queryText, [listenerID]);
  const { response, error } = result;
  if (error) {
    return {
      message: "Albums cannot be returned",
      error: error.stack,
    };
  }
  let message = response.rows ? "Albums returned." : "Albums not found";
  return {
    albums: response.rows,
    message,
  };
};

export default {
  createAlbum,
  getAlbum,
  getAllAlbums,
  updateAlbum,
  deleteAlbum,
  getAlbumsOfArtist,
  incrementLike,
  getLikedAlbumsOfListener,
};
