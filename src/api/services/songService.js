import db from "../../database";
import artistService from "./artistService";

const createSong = async (title, albumID, producerIDs) => {
  console.log("** CREATE SONG **");
  const queryText =
    "INSERT INTO song(title,albumID,likes)" +
    " VALUES($1,$2,$3)" +
    " RETURNING id,title,albumID,likes;";
  const result = await db.queryP(queryText, [title, albumID, 0]);
  const { response, error } = result;
  let errorArtistSongProduce;
  if (response && response.rows) {
    const song = result.response.rows[0];
    const queryText =
      'INSERT INTO "artist-song-produce"(artistID,songID)' + " VALUES($1,$2);";
    const promises = producerIDs.map((producerID) => {
      return db.queryP(queryText, [producerID, song.id]);
    });

    const results = await Promise.all(promises);
    console.log(results);
    results.forEach((result) => {
      if (result.error) {
        errorArtistSongProduce = result.error;
      }
    });
  }
  if (errorArtistSongProduce) {
    return {
      message: "Song cannot be created",
      error: errorArtistSongProduce.stack,
    };
  }
  return {
    message: response ? "Song created." : "Song cannot be created",
    error: error ? error.stack : undefined,
  };
};

const getSong = async (songID) => {
  console.log("** GET SONG **");
  const queryText =
    "SELECT s.id, s.title, s.likes, s.albumid, a.title AS album, genre" +
    " FROM song AS s" +
    " INNER JOIN album AS a on a.id = s.albumid" +
    " WHERE s.id = $1;";
  const result = await db.queryP(queryText, [songID]);
  const { response, error } = result;
  if (error) {
    return {
      message: "Song cannot be returned",
      error: error.stack,
    };
  }
  const song = response.rows[0];
  let message = "Song not found";
  if (song) {
    message = "Song returned.";
    const artistsResult = await artistService.getArtistsOfSong(song.id);
    if (artistsResult.error) {
      console.log(artistsResult.error);
    } else {
      song.producers = artistsResult.artists;
    }
  }
  return {
    song: song,
    message,
  };
};

const getAllSongs = async () => {
  console.log("** GET ALL SONGS **");
  const queryText =
    "SELECT s.id, s.title, s.likes, genre, a.title as album, albumid" +
    " FROM song AS s" +
    " INNER JOIN album AS a on a.id = s.albumid" +
    " ORDER BY s.likes DESC;";
  const result = await db.queryP(queryText);
  const { response, error } = result;
  if (error) {
    return {
      message: "Songs cannot be returned",
      error: error.stack,
    };
  }
  let message = response.rows ? "Songs returned." : "Songs not found";
  return {
    songs: response.rows,
    message,
  };
};

const searchSongs = async (keyword) => {
  console.log("** GET ALL SONGS **");
  const queryText =
    "SELECT s.id, s.title, s.likes, genre, a.title as album, albumid" +
    " FROM song AS s" +
    " INNER JOIN album AS a on a.id = s.albumid" +
    ` WHERE s.title ILIKE ('%${keyword}%');`;
  const result = await db.queryP(queryText);
  const { response, error } = result;
  if (error) {
    return {
      message: "Songs cannot be returned",
      error: error.stack,
    };
  }
  let message = response.rows ? "Songs returned." : "Songs not found";
  return {
    songs: response.rows,
    message,
  };
};

const updateSong = async (songID, title) => {
  console.log("** UPDATE SONG **");
  const queryText = "UPDATE song" + " SET title = $2" + " WHERE id = $1";
  const result = await db.queryP(queryText, [songID, title]);

  return {
    message: result.response ? "Song updated." : "Song cannot be updated",
    error: result.error ? result.error.stack : undefined,
  };
};

const deleteSong = async (songID) => {
  console.log("** DELETE SONG **");
  const queryText = "DELETE from song" + " WHERE id = $1";
  const result = await db.queryP(queryText, [songID]);

  return {
    message: result.response ? "Song deleted." : "Song cannot be deleted.",
    error: result.error ? result.error.stack : undefined,
  };
};

const getSongsOfArtist = async (artistID) => {
  console.log("** GET ALL SONGS OF ARTIST **");
  const queryText =
    "SELECT s.id, s.title, s.likes, s.albumid, a.genre, a.title as album" +
    " FROM song AS s" +
    ' INNER JOIN "artist-song-produce" AS asp ON asp.songid = s.id' +
    " INNER JOIN album AS a ON s.albumid = a.id" +
    " WHERE asp.artistid = $1" +
    " ORDER BY s.likes DESC;";
  const result = await db.queryP(queryText, [artistID]);
  const { response, error } = result;
  if (error) {
    return {
      message: "Songs cannot be returned",
      error: error.stack,
    };
  }
  let message = response.rows ? "Songs returned." : "Songs not found";
  return {
    songs: response.rows,
    message,
  };
};

const getSongsOfAlbum = async (albumID) => {
  console.log("** GET ALL SONGS OF ALBUM **");
  const queryText =
    "SELECT s.id, s.title, s.likes, s.albumid, a.genre, a.title as album" +
    " FROM song AS s" +
    " INNER JOIN album AS a ON s.albumid = a.id" +
    " WHERE albumid = $1";
  const result = await db.queryP(queryText, [albumID]);
  const { response, error } = result;
  if (error) {
    return {
      message: "Songs cannot be returned",
      error: error.stack,
    };
  }
  let message = response.rows ? "Songs returned." : "Songs not found";
  return {
    songs: response.rows,
    message,
  };
};

const incrementLike = async (songID, listenerID) => {
  console.log("** ADD LIKE SONG**");
  const queryText =
    "UPDATE song" +
    " SET likes = likes + 1 " +
    " WHERE id = $1 AND id NOT IN (" +
    " SELECT songid" +
    ' FROM "listener-song-like"' +
    " WHERE listenerid = $2" +
    ");";
  const result = await db.queryP(queryText, [songID, listenerID]);

  return {
    message: result.response ? "Song updated." : "Song cannot be updated",
    error: result.error ? result.error.stack : undefined,
  };
};

const incrementLikeInAlbum = async (albumID, listenerID) => {
  console.log("** ADD LIKE SONGS IN ALBUM **");
  const queryText =
    "UPDATE song" +
    " SET likes = likes + 1" +
    " WHERE albumid = $1 AND id NOT IN (" +
    " SELECT songid" +
    ' FROM "listener-song-like"' +
    " WHERE listenerid = $2" +
    ");";
  const result = await db.queryP(queryText, [albumID, listenerID]);

  return {
    message: result.response
      ? "Songs Liked."
      : "Songs cannot be liked. (check error logs)",
    error: result.error ? result.error.stack : undefined,
  };
};

const getLikedSongsOfListener = async (listenerID) => {
  console.log("** GET ALL SONGS OF LISTENER LIKE **");
  const queryText =
    "SELECT s.id, s.title, s.likes, s.albumid, a.title as album, a.genre" +
    ' FROM "listener-song-like" AS lsl' +
    " INNER JOIN song AS s ON s.id = lsl.songid" +
    " INNER JOIN album AS a ON s.albumid = a.id" +
    " WHERE listenerid = $1" +
    " ORDER BY s.likes DESC;";
  const result = await db.queryP(queryText, [listenerID]);
  const { response, error } = result;
  if (error) {
    return {
      message: "Songs cannot be returned",
      error: error.stack,
    };
  }
  let message = response.rows ? "Songs returned." : "Songs not found";
  return {
    songs: response.rows,
    message,
  };
};

const getSongsOfGenre = async (genre) => {
  console.log("** GET ALL SONGS OF GENRE **");
  const queryText =
    "SELECT s.id, s.title, s.likes, s.albumid, a.title AS album, genre" +
    " FROM song AS s" +
    " INNER JOIN album AS a on a.id = s.albumid" +
    " WHERE genre = $1" +
    " ORDER BY s.likes DESC;";

  const result = await db.queryP(queryText, [genre]);
  const { response, error } = result;
  if (error) {
    return {
      message: "Songs cannot be returned",
      error: error.stack,
    };
  }
  let message = response.rows ? "Songs returned." : "Songs not found";
  return {
    songs: response.rows,
    message,
  };
};

export default {
  createSong,
  getSong,
  getAllSongs,
  updateSong,
  deleteSong,
  getSongsOfArtist,
  getSongsOfAlbum,
  incrementLike,
  incrementLikeInAlbum,
  getLikedSongsOfListener,
  searchSongs,
  getSongsOfGenre,
};
